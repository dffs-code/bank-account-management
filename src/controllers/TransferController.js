const Accounts = require('../models/account');
const Transfers = require('../models/transfer');

module.exports = {
  async create(req, res) {
    try {
      const { sender, receiver, value } = req.body;
        const senderAccount = await Accounts.findByPk(sender);
        const receiverAccount = await Accounts.findByPk(receiver);

        if (value <= 2000) {
          if((senderAccount.balance - value) >= 0){
            const sending = await senderAccount.update({
              balance: senderAccount.balance -= value
            })
            const receiving = await receiverAccount.update({
              balance: receiverAccount.balance += value
            })
            if(sending && receiving){
              const response = await Transfers.create({
                sender,
                receiver,
                value
              })
              return res.status(201).json(response);
            }
          } else {
            return res.status(400).json({message: 'Your balance cannot be negative '})
          }
        } else{
          return res.status(400).json({message: 'Maximum Value Exceeded '})
        }


    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error});
    }
  },
  async index(req, res) {
    try {
        const response = await Transfers.findAll(); 
        res.status(200).json(response);
      if(!response) res.status(404).json({ message: 'No Account found'})
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
}