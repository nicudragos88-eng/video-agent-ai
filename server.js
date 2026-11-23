import express from 'express';
import multer from 'multer';
import 'dotenv/config';
const app=express();
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024},fileFilter:(_req,file,cb)=>cb(null,file.mimetype.startsWith('image/'))});
app.use(express.static('public'));
app.get('/api/status',(_req,res)=>res.json({configured:Boolean(process.env.REPLICATE_API_TOKEN)}));
app.post('/api/generate',upload.single('image'),async(req,res)=>{
 const {prompt,mode,aspect_ratio='16:9'}=req.body;
 if(!prompt?.trim()||prompt.length>2000)return res.status(400).json({error:'Introduce un prompt de hasta 2000 caracteres.'});
 if(!['text','image'].includes(mode))return res.status(400).json({error:'Modo inválido.'});
 if(mode==='image'&&!req.file)return res.status(400).json({error:'Sube una imagen.'});
 const token=process.env.REPLICATE_API_TOKEN;
 if(!token)return res.status(503).json({error:'Configura REPLICATE_API_TOKEN en Render para activar la generación real.'});
 const model=mode==='image'?process.env.IMAGE_VIDEO_MODEL:process.env.TEXT_VIDEO_MODEL;
 if(!model)return res.status(503).json({error:'Configura el modelo de vídeo correspondiente en Render.'});
 try{
  const input={prompt,aspect_ratio};
  if(req.file)input.image=`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const response=await fetch(`https://api.replicate.com/v1/models/${model}/predictions`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json',Prefer:'wait=5'},body:JSON.stringify({input})});
  const data=await response.json();
  if(!response.ok)return res.status(502).json({error:data.detail||JSON.stringify(data)});
  res.json({id:data.id,status:data.status,output:data.output});
 }catch(e){res.status(502).json({error:'No se pudo contactar con el proveedor.'});}
});
app.get('/api/predictions/:id',async(req,res)=>{
 if(!/^[a-zA-Z0-9_-]+$/.test(req.params.id))return res.status(400).json({error:'ID inválido'});
 if(!process.env.REPLICATE_API_TOKEN)return res.status(503).json({error:'Proveedor no configurado'});
 try{const response=await fetch(`https://api.replicate.com/v1/predictions/${req.params.id}`,{headers:{Authorization:`Bearer ${process.env.REPLICATE_API_TOKEN}`}});const data=await response.json();res.status(response.ok?200:502).json({status:data.status,output:data.output,error:data.error});}catch{res.status(502).json({error:'Error consultando generación'});}
});
app.listen(process.env.PORT||3000,()=>console.log('Video Agent listo'));
