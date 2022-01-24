const Accounts = require('../models/account');
const Transfers = require('../models/transfer');
const bcrypt = require('bcrypt');

module.exports = {
  async create(req, res) {
    try {
      const { sender, receiver, value, password } = req.body;

      // remetente e destinatário não podem ser o mesmo valor
      if (sender == receiver)
        return res.status(401).json({ message: 'You cannot transfer to yourself' });

<<<<<<< HEAD
      // valor da transferência não pode ser menor ou igual a zero
      if (value <= 0)  
=======
      // valor da transferência não pode ser menor ou igual a zero e nem maior que 2000
      if (value <= 0 || value > 2000)  
>>>>>>> 64db759f5cf98bcc5d4706e2c389488f329e73fc
        return res.status(401).json({ message: 'Invalid Transfer Value' });

      const senderAccount = await Accounts.findByPk(sender);
      const receiverAccount = await Accounts.findByPk(receiver);

      if ((senderAccount.balance - value) < 0)
        return res.status(400).json({ message: 'Your balance cannot be negative' })
      //a transferência não pode deixar o remetente com valor negativo na conta

      bcrypt.compare(password, senderAccount.password, async (err, result) => {
        if (err) 
        return res.status(400).json({ error: err }); //erro na comparação

        if (result) { //se o resultado da comparação foi true, a senha está correta
          const sending = await senderAccount.update({
            balance: senderAccount.balance -= value
          })
          const receiving = await receiverAccount.update({
            balance: receiverAccount.balance += value
          })
          if (sending && receiving) {
            const response = await Transfers.create({
              sender,
              receiver,
              value
            })
            return res.status(201).json(response);
          }
        } else {
          return res.status(401).json({
            isCorrect: result,
            message: 'Invalid Password'
          })
        }
      });
    } catch (error) {
      console.log(error)
      if (error.parent.errno === 1265) {
        return res.status(400).send({ message: "Invalid Data Types" });
      }
      return res.status(500).send({ message: error });
    }
  },

  async index(req, res) {
    try {
      const response = await Transfers.findAll({
        attributes: [
          'id',
          'sender',
          'receiver',
          'value'
        ]
      });
      res.status(200).json(response);
      if (!response) res.status(404).json({ message: 'No Transfers Registered' })
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },

  async show(req, res) {
    try {
      /**
       * este método mostra somente a conta cujo id seja o mesmo passado pela url (/transfers/:id)
       * são puxados do banco somente os campos necessários, por questão de segurança de
       * pegar o hash da senha neste caso não se faria necessário, e abriria vulnerabilidades
       */
      const { id } = req.params;
      const response = await Transfers.findByPk(id, {
        include: [{
          association: 'sender_account',
          attributes: ['id', 'name', 'cpf', 'balance']
        }, {
          association: 'receiver_account',
          attributes: ['id', 'name', 'cpf', 'balance']
        }]
      });
      res.status(200).json(response);
      if (!response) res.status(404).json({ message: 'Account Not found' })
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },
}