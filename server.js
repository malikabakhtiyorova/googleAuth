const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser())

//google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '1073318607046-aoa8gbg5bpui96h3n5vv4mig3e8ce2jr.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')

app.get('/', (req,res) => {
    res.render('index')
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.post('/login', (req,res) => {
    let token = req.body.token
    
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID, 
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload)
    }
    verify().then(()=> {
        res.cookie('session-cookie', token);
        res.send('success');
    })
    .catch(console.error);
    
})

app.get('/profile', (req,res) => {
    let user = req.user;
    res.render('profile',{user})
})

app.get('/protectedroute', (req,res) => {
    res.render('protectedroute')
})

app.get('/logout', (req,res) => {
    res.clearCookie('session-token');
    res.redirect('/login')
})


function checkAuthenticated(req,res,next) {
    let token = req.cookies('session-token');

    let user = {};

    async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  user.name = payload.name
  user.email = payload.email
  user.picture = payload.picture
}
verify()
.then(()=> {
    req.user = user
    next()
})
.catch(err => {
    req.redirect('/login')
})
}

app.listen(PORT, console.log(PORT))