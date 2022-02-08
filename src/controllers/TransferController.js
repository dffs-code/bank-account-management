const Accounts = require('../models/account');
const Transfers = require('../models/transfer');
const bcrypt = require('bcrypt');

module.exports = {
  async create(req, res) {
    try {

      const { newSenderBalance, newReceiverBalance, payload, senderAccount_id, receiverAccount_id } = req;

      const sent = await Accounts.update(newSenderBalance, { 
        where: {
          id: senderAccount_id
        } 
      })
      const received = await Accounts.update(newReceiverBalance, { 
        where: { 
          id: receiverAccount_id
        }
      })
      
      if (sent && received) {
        const response = await Transfers.create(payload)
        return res.status(201).json(response);
      }
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