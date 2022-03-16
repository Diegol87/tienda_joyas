const express = require('express')
const joyas = require('./data/joyas.js')
const app = express()
app.listen(3000, () => console.log('Your app listening on port 3000'))

app.get('/', (req, res) => {
  res.send('Oh wow! this is working =)')
})

//Ejericicio 1
const HATEOASV1 = () =>
  joyas.results.map((j) => {
    return {
      name: j.name,
      href: `http://localhost:3000/joyas/${j.id}`,
    }
  })

//Ejercicio 2
  const HATEOASV2 = () =>
    joyas.results.map((j) => {
      return {
        joya: j.name,
        src: `http://localhost:3000/joyas/${j.id}`,
      }
    })

  app.get('/api/v1/joyas', (req, res) => {
    res.send({
      joyas: HATEOASV1()
    })
  })

  app.get('/api/v2/joyas', async(req, res) => {
    const { values, page } = req.query

    //Ejercicio 6
    if(page) {
      const datos = await HATEOASV2()
      return res.json(datos.slice(page * 3 - 3, page * 3))
    }

    //Ejercicio 7
    if(values === "asc") {
      const order = joyas.results.sort((a, b) => (a.values > b.values ? 1 : -1))
      return res.json(order)
    }
    if(values === "desc") {
      const order = joyas.results.sort((a, b) => (a. values < b.values ? 1 : -1))
      return res.json(order)
    }

    res.send({
      joyas: HATEOASV2()
    })
  })

  //Ejercicio 3
  const filtroCategory = (category) => {
    return joyas.results.filter((j) => j.category == category)
  }

  app.get('/api/v2/category/:cuerpo', (req, res) => {
    const { cuerpo } = req.params
    res.send({
      cant: filtroCategory(cuerpo).length,
      joyas: filtroCategory(cuerpo),
    })
  })

  //Ejercicio 4
  //primero definimos la constante joya
  //Relaizar la consulta con "http://localhost:3000/api/v2/joya/6?fields=id,name,metal,value"
  const joya = (id) => joyas.results.find((j) => j.id == id)

  const fieldsSelect = (joya, fields) => {
    for(propiedad in joya) {
      if(!fields.includes(propiedad)) delete joya[propiedad]
    }
    return joya
  }

  app.get('/api/v2/joya/:id', (req, res) => {
    const { id } = req.params
    const { fields } = req.query
    if(fields) return res.send({
      joya: fieldsSelect(joya(id), fields.split(","))
    })
    joya(id)
      ? res.send({
        joya: joya(id)
      })
      //Ejercicio 5
      : res.status(400).send({
        error: "404 Not Found",
        message: "No existe una joya con ese ID"
      })
  })
