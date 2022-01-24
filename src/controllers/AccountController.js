const Accounts = require('../models/account');
const { cpf } = require('cpf-cnpj-validator');
const bcrypt = require('bcrypt');
const generateHashedPassword = require('../utils/generateHashedPassword');

module.exports = {
  async create(req, res) {
    try {
      const { name, password } = req.body;
      const sentCpf = req.body.cpf.toString();

      if(password === '') return res.status(400).json({message: "Password cannot be null"})

      if (cpf.isValid(sentCpf)) {

        const response = await Accounts.create({
          name,
          cpf: sentCpf,
          password: generateHashedPassword(password),
        });
        /**
         * não é enviado o response do cadastro para o client por questão de segurança
         */
        if(response) return res.status(201).send();

      } else {
        return res.status(401).json({ message: 'CPF Not Valid' })
      }

    } catch (error) {
      //se o cpf já está sendo utilizado
      if(error.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ message: 'CPF Already Used' });
      
      console.log(error)
      return res.status(500).send({ message: error });
    }
  },

  async index(req, res) {
    try {
      /**
       * este método mostra todas as contas
       * são puxados do banco somente os campos necessários, por questão de segurança de
       * pegar o hash da senha neste caso não se faria necessário, e abriria vulnerabilidades
       */
      const response = await Accounts.findAll({
        attributes: [
          'id',
          'name',
          'cpf',
          'balance'
        ]
      });
      res.status(200).json(response);
      if (!response) res.status(404).json({ message: 'No Account found' })
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },

  async show(req, res) {
    try {
      /**
       * este método mostra somente a conta cujo id seja o mesmo passado pela url (/accounts/:id)
       * são puxados do banco somente os campos necessários, por questão de segurança de
       * pegar o hash da senha neste caso não se faria necessário, e abriria vulnerabilidades
       */
      const { id } = req.params;
      const response = await Accounts.findByPk(id, {
        attributes: [
          'id',
          'name',
          'cpf',
          'balance'
        ], include: [{
            association: 'sent_transfers',
            attributes: ['id', 'sender', 'receiver', 'value']
          },{
            association: 'received_transfers',
            attributes: ['id', 'sender', 'receiver', 'value']
        }]
      });
      res.status(200).json(response);
      if (!response) res.status(404).json({ message: 'Account Not found' })
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },

  async deposit(req, res) {
    try {
      const { cash, password } = req.body;
      const sentCpf = req.body.cpf.toString();

      if(cash <= 0 || cash > 2000) return res.status(400).json({message: 'Invalid Cash Value'});

      if (cpf.isValid(sentCpf)) {
        const account = await Accounts.findOne({
          where: {
            cpf: sentCpf
          }
        });
        if (account) {

          //compara senha para executar depósito
          bcrypt.compare(password, account.password, async (err, result) => {
            if (err) res.status(400).json({ error: err });

            if (result) {

              const newBalance = account.balance + cash;
              const response = await account.update({
                balance: newBalance
              });
              /**
              * não é enviado o response do cadastro para o client por questão de segurança
              */
              if (response) return res.status(200).send();

              return res.status(404).json({ message: 'Account Not found' });

            } else {
              return res.status(401).json({
                isCorrect: result,
                message: 'Invalid Password'
              })
            }
          })//fim da comparação de senha
        }
      }//fim da verificação se cpf é válido
    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }
  },

  async withdrawal(req, res) {
    try {
      const { cash, password } = req.body;
      const sentCpf = req.body.cpf.toString();

      if(cash <= 0 || cash > 2000) return res.status(400).json({message: 'Invalid Cash Value'});

      if (cpf.isValid(sentCpf)) {
        const account = await Accounts.findOne({
          where: {
            cpf: sentCpf
          }
        });
        if (account) {

          //compara senha para executar depósito
          bcrypt.compare(password, account.password, async (err, result) => {
            if (err) res.status(400).json({ error: err });

            if (result) {
              

              const newBalance = account.balance - cash;
              const response = await account.update({
                balance: newBalance
              });
              /**
              * não é enviado o response do cadastro para o client por questão de segurança
              */
              if (response) return res.status(200).send();

              return res.status(404).json({ message: 'Account Not found' });

            } else {
              return res.status(401).json({
                isCorrect: result,
                message: 'Invalid Password'
              })
            }
          })//fim da comparação de senha
        }
      }//fim da verificação se cpf é válido
    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }
  },

  async changePassword(req, res) {
    try {
      /** 
      * para segurança na mudança de senha, é solicitado o id (ou número de conta)
      *pelo parâmetro da url (account/:id)
      *
      *além disso, o cpf da conta também é solicitado pelo corpo da requisição
      *somente se os dois estiverem corretos, a mudança é feita
      */
      const { id } = req.params;
      const { password } = req.body;
      const sentCpf = req.body.cpf.toString();

      if (cpf.isValid(sentCpf)) {
        const account = await Accounts.findOne({
          where: {
            cpf: sentCpf
          }
        });
        if (account.id == id) {
          const response = await account.update({
            password: generateHashedPassword(password)
          });
          response.password = undefined;
          if (response) return res.status(200).json({message: 'Password changed successfully'});
          
        } else {
            return res.status(404).json({ message: 'Incorrect Account or CPF' })
        }
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },
}