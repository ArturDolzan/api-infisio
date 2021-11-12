const sgMail = require('@sendgrid/mail')
const configEmail = require('../../config/emailConfig')
const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const config = require('../../config/apiUrl')

class EmailHelper {
    
    lerHtmlConfirmacao(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    }

    confirmacaoContaEmail(emailDestinatario, hashEmail) {

        //emailDestinatario = 'arturdolzan@gmail.com'

        this.lerHtmlConfirmacao(path.dirname(require.main.filename) + '/templatesEmail/confirmacao_email.html', (err, html) => {

            let template = handlebars.compile(html)

            let replacements = {
                link_confirmacao_email: `${config.routeServer}ativarConta?hash=${hashEmail}`
            }
            let htmlToSend = template(replacements);

            sgMail.setApiKey(configEmail.sendGridKey)
            const msg = {
                to: emailDestinatario,
                from: 'ContatoInfisio@infisio.com.br',
                subject: 'Confirmação de conta (Não responda este e-mail)',
                html: htmlToSend,
            };
            sgMail.send(msg);

            
            
            // let usuario = 'contatoinfisioapp@gmail.com'
            // let senha = 'infisiohero123'
            // //emailDestinatario = 'arturdolzan@gmail.com'

            // let transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: usuario,
            //         pass: senha
            //     }
            // });

            // let mailOptions = {
            //     from: usuario,
            //     to: emailDestinatario,
            //     subject: 'Teste Confirmação de conta (Não responda este e-mail)',
            //     html: htmlToSend 
            // };

            // transporter.sendMail(mailOptions, function(error, info){
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email enviado: ' + info.response);
            //     }
            // });

        })
    }

    esqueciMinhaSenhaEmail(emailDestinatario, hashEmail) {

        //emailDestinatario = 'arturdolzan@gmail.com'

        this.lerHtmlConfirmacao(path.dirname(require.main.filename) + '/templatesEmail/esqueci_minha_senha_email.html', (err, html) => {

            let template = handlebars.compile(html)

            let hashReady = Buffer.from(JSON.stringify(hashEmail)).toString('base64')
            
            let replacements = {
                link_recuperar_minha_senha: `${config.routeServer}recuperarMinhaSenha?&hash=${hashReady}`
            }
            let htmlToSend = template(replacements);

            sgMail.setApiKey(configEmail.sendGridKey)
            const msg = {
                to: emailDestinatario,
                from: 'ContatoInfisio@infisio.com.br',
                subject: 'Recuperação de senha (Não responda este e-mail)',
                html: htmlToSend,
            };
            sgMail.send(msg);

            // let usuario = 'contatoinfisioapp@gmail.com';
            // let senha = 'infisiohero123'; 

            // let transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: usuario,
            //         pass: senha
            //     }
            // });

            // let mailOptions = {
            //     from: usuario,
            //     to: emailDestinatario,
            //     subject: 'Recuperação de senha (Não responda este e-mail)',
            //     html: htmlToSend 
            // };

            // transporter.sendMail(mailOptions, function(error, info){
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email enviado: ' + info.response);
            //     }
            // });

        })
    }

}

module.exports = {
    EmailHelper
}