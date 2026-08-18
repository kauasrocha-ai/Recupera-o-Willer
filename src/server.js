import express from 'express'
import cors from 'cors'
import {prisma} from './lib/prisma.ts'

const app = express()
app.use (cors())
app.use (express.json())
const port = 3000

//rota get Equipe
app.get('/equipes', async (req, res) =>{
    try{
    const getFarms = await prisma.equipe.findMany({
        include: {
            desenvolvedores:true
        }
    })
    return res.status(200).json(getFarms)
  } catch(error) {
    return res.status(500).json({ error: "equipe não encontrada" });
  }
});

app.get('/equipes/:id', async (req, res) => {
    const { id } = req.params

    const equipe = await prisma.equipe.findUnique({
        where: { id: Number(id) },
        include: {
            desenvolvedores: true
        }
    })

    return res.status(200).json(equipe)
})




//rota get desenvolvedores
app.get('/desenvolvedores', async (req, res) => {
    try {
        const getDesenvolvedores = await prisma.desenvolvedor.findMany({ //cuidar aq 
            include: {
                equipe: true
            }
        })

        return res.status(200).json(getDesenvolvedores)
    } catch (error) {
        return res.status(500).json({ error: "Desenvolvedores não encontrados" })
    }
})

app.get('/desenvolvedores/:id', async (req, res) => {
    const { id } = req.params

    const desenvolvedor = await prisma.desenvolvedor.findUnique({
        where: { id: Number(id) },
        include: {
            equipe: true
        }
    })

    return res.status(200).json(desenvolvedor)
})


app.put('/equipes/:id', async (req, res) =>{
    const {id} = req.params;
    try{
        const {nome, nacionalidade} = req.body;
        const updateEquipe = await prisma.equipe.update({
        where: {id: Number(id)},
        data:{
            nome,
            nacionalidade
        },
    });
    res.json(updateEquipe)
    }

    
    catch(err){
        res.status(400).json("Erro ao atualizar usuário.")
    }
    
})

app.put('/desenvolvedores/:id', async (req, res) =>{
    const {id} = req.params;
    try{
        const {nome, camisa} = req.body;
        const updateDesenvolvedor = await prisma.desenvolvedor.update({
        where: {id: Number(id)},
        data:{
            nome,
            camisa: Number(camisa)
        },
    });
    res.json(updateDesenvolvedor)
    }

    
    catch(err){
        res.status(400).json("Erro ao atualizar usuário.")
    }
    
})




//rota post equipe
app.post("/equipes", async (req, res) => {
    try{
    const { nome, nacionalidade } = req.body;
    const postEquipe = await prisma.equipe.create({
      data: {
        nome,
        nacionalidade
      },
    });
    return res.status(201).json(postEquipe);
  } catch(error) {
    return res.status(500).json({ error: "não postou a equipe" });
  }
});

app.post ('/desenvolvedores', async (req, res) =>{
    const {nome, camisa, equipeId} = req.body;
    
    const postDesenvolvedor = await prisma.desenvolvedor.create({
        data: {
            nome,
            camisa: Number(camisa),
            equipeId: Number(equipeId)
        },
    })
    return res.status(201).json(postDesenvolvedor)
})

//Delete equipe
app.delete("/equipes/:id", async(req, res) =>{
  const {id} = req.params
  await prisma.equipe.delete({
     where: {id: Number(id)}
  })

  res.status(204).send() 
});


//Delete desenvolvedores
app.delete("/desenvolvedores/:id", async(req, res) =>{
  const {id} = req.params
  await prisma.desenvolvedor.delete({
     where: {id: Number(id)}
  })

  res.status(204).send() 
});

app.listen(port, () =>{
    console.log(`Server rodando na porta: ${port}.`)
})
