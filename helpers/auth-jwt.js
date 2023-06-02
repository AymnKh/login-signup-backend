import expressJwt from 'express-jwt';
import Jwt from 'jsonwebtoken';
import Http from 'http-status-codes';

const authJwt = () => { 
    return expressJwt.expressjwt({ // return the expressjwt function
        secret: process.env.JWT_SECRET, // set the secret
        algorithms: ['HS256'], // set the algorithm
        getToken: (req, res) => {  // get the token
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // if the token is in the headers
                const token = req.headers.authorization.split(' ')[1]; // get the token
                return Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {   // verify the token
                    if (err) { // if there is an error
                        return res.status(Http.BAD_REQUEST).json({ // return the status bad request
                            message: 'Token is not valid', // return the message
                        })
                    }
                    return token; // return the token
                })
            }
            
            return null; // return null
         }
    }).unless({ // unless the the following path
        path: [
            '/api/v1/login',
            '/api/v1/register',
            '/api/v1/public/uploads'
        ]
    })
}

 
export  default authJwt;

