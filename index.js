const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Question = require("./database/Question");
const Answer = require("./database/Answer");
//Database

connection.authenticate().then(() => {
  console.log("Conexão com o banco de dados bem-sucedida")
}).catch((msgError) => {
  console.log(msgError);
})

// Estou dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Rotas
app.get("/", (req, res) => {
  Question.findAll({
    raw: true, order: [
      ['id', 'DESC']
    ]
  }).then(questions => {
    res.render("index", {
      questions: questions
    });
  })
});

app.get("/ask", (req, res) => {
  res.render("ask");
})

app.post("/savequestion", (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  Question.create({
    title: title,
    description: description
  }).then(() => {
    res.redirect("/")
  })
});

app.post("/saveanswer", (req, res) => {
  let body = req.body.body;
  let questionId = req.body.question;
  Answer.create({
    body: body,
    questionId: questionId
  }).then(() => {
    res.redirect("/question/" + questionId)
  })
})

app.get("/question/:id", (req, res) => {
  let id = req.params.id;
  Question.findOne({
    where: { id: id }
  }).then(question => {
    if (question != undefined) {
      Answer.findAll({
        where: { questionId: question.id },
        order: [['id', 'DESC']]
      }).then(answers => {
        res.render("question", {
          question: question,
          answers: answers
        });
      });
    } else {
      res.redirect('/');
    }
  });
})


app.listen(3000, () => { console.log("App rodando!"); });