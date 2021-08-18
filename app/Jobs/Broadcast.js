'use strict';
const Mail = use('Mail');
const Logger = use('Logger');
const Env = use('Env');
const Collaborator = use('App/Models/Collaborator');
const User = use('App/Models/User');
const Helpers = use('Helpers');
const randomstring = use('randomstring');
const Token = use('App/Models/Token');
const moment = require('moment');
const axios = use('axios');
const fs = require("fs");
var path = require('path');

class Broadcast {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'Broadcast-grafias-job'
  }

  // This is where the work is done.
  async handle (data) {
    console.log('Broadcast: run');
    try {
      const receivers = [];
      const type = data.type;
      const ids = typeof(data.ids) === 'string' ? JSON.parse(data.ids) : data.ids;

      if (type === 'user') {
        for(let i=0; i<ids.length; i++) {
          const user = await User.query().where('id', ids[i]).first();
          if (user) receivers.push(user);
        }
      } else if (type === 'collaborator') {
        if (ids.length > 0) {
          let collaborators = await Collaborator.query().whereIn('id', ids).fetch();
          collaborators = collaborators.toJSON();

          for(let i=0; i<collaborators.length; i++) {
            const collaborator = collaborators[i];
            const user = await User.query().where('id', collaborator.user_id).first();
            if (user) receivers.push(user);
          }
        } else {
          let collaborators = await Collaborator.query().where('inviter_id', data.user_id).fetch();
          collaborators = collaborators.toJSON();
          for (let i=0; i<collaborators.length; i++) {
            const user = await User.query().where('id', collaborators[i].user_id).first();
            if (user) receivers.push(user);
          }
        }
      }

      if (receivers.length > 0) {
        for (let i=0; i<receivers.length; i++) {
          const receiver = receivers[i];
          console.log('Broadcast to ' + receiver.email + ' : run');
          // const dataEmail = {
          //   title: data.title,
          //   content: data.content,
          // }
          try {
            const attachments = [];
            if (data.file) {
              let filePath = data.file;
              filePath = filePath.split('file')[1];
              if (filePath) {
                filePath = Helpers.publicPath('uploads' + filePath);
                const fileBase64 = fs.readFileSync(filePath).toString("base64");
                const fileName = path.basename(filePath);
                let extFile = path.extname(fileName);
                extFile = extFile.replace('.', '');
                const type = "application/" + extFile;

                const fileAttachment = {
                  content: fileBase64,
                  filename: fileName,
                  type: type,
                  disposition: "attachment"
                }

                attachments.push(fileAttachment);
              }
            }

            const emailData = {
              personalizations: [
                {
                  to: [
                    {
                      email: receiver.email,
                      name: receiver.name
                    }
                  ],
                  dynamic_template_data: {
                    title: data.title,
                    content: data.content,
                    subject: data.title
                  }
                }
              ],
              from: {
                email: Env.get('SENDER_MAIL'),
                name: Env.get('SENDER_NAME')
              },
              template_id: "d-ead497076c9642f4b3b9e137b21ba736"
            }

            if (attachments.length > 0) {
              emailData.attachments = attachments;
            }
            console.log('send to :' + receiver.email);
            //Send Email
            await axios.post(Env.get('SENDGRID_MAIL_URL'), emailData, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Env.get('SENDGRID_API')
              }
            })
            console.log('send to :' + receiver.email + '(done)');
          } catch (e) {
            Logger.transport('file').error('Broadcast.handle: ', e);
          }
          console.log('Broadcast to ' + receiver.email + ' : done');
        }
      }

    } catch (e) {
      Logger.transport('file').error('Broadcast.handle: ', e);
    }
    console.log('Broadcast: done');
  }
}

module.exports = Broadcast

