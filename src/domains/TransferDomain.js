const Accounts = require('../models/account');
const bcrypt = require('bcrypt');

module.exports = {
  async store(req, res, next) {
    try {
      const { sender, receiver, value, password } = req.body;

      // remetente e destinatário não podem ser o mesmo valor
      if (sender == receiver) return res.status(401).json({ message: 'You cannot transfer to yourself' });

      // valor da transferência não pode ser menor ou igual a zero e nem maior que 2000
      if (value <= 0 || value > 2000) return res.status(401).json({ message: 'Invalid Transfer Value' });

      const senderAccount = await Accounts.findByPk(sender);
      const receiverAccount = await Accounts.findByPk(receiver);

      //a transferência não pode deixar o remetente com valor negativo na conta
      if ((senderAccount.balance - value) < 0) return res.status(400).json({ message: 'Your balance cannot be negative' })


      bcrypt.compare(password, senderAccount.password, async (err, result) => {
        if (err) return res.status(400).json({ error: err }); //erro na comparação

        if (!result) return res.status(401).json({ isCorrect: result, message: 'Invalid Password' });

        const newSenderBalance = {
          balance: senderAccount.balance - value
        }
        const newReceiverBalance = {
          balance: receiverAccount.balance + value
        }
        const payload = {
          sender,
          receiver,
          value
        }
        req.senderAccount_id = senderAccount.id;
        req.receiverAccount_id = receiverAccount.id;
        req.newSenderBalance = newSenderBalance;
        req.newReceiverBalance = newReceiverBalance;
        req.payload = payload;
        return next();
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}