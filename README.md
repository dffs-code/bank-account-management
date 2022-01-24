# Gerenciamento de Contas de Banco

Este projeto é uma API REST desenvolvida em NodeJs utilizando Express e o Sequelize ORM, e para banco de dados, foi utilizado o MySQL.
Ela consiste no gerenciamento de contas de banco, com algumas funcionalidades básicas, como depósito e transferências.

## Como instalar

Para instalar este projeto, basta baixar o código-fonte e, no diretório raiz do projeto, rodar um dos comandos abaixo no terminal:

   `npm install` 		ou 		`yarn install`

Também é necessário incluir um arquivo `.env` na raiz do projeto, contendo as variáveis de ambiente abaixo, trocando os valores para os de sua escolha:
```
MYSQL_HOST=localhost
MYSQL_USERNAME=root
MYSQL_PASSWORD=admin
MYSQL_DATABASE=account_manager
MYSQL_PORT=3306
```
Após instaladas as dependências, é o momento de criar o banco, bem como suas tabelas e relacionamentos. 
## Criando Banco e Tabelas

O Sequelize possui uma lib de command line interface (CLI) que é a sequelize-cli, e esta foi instalada no passo anterior. Dessa forma, ela pode ser utilizada em conjunto com o comando npx. 

Então, para que façamos uso desta biblioteca, o comando de criação do banco de dados é o seguinte: 
```
npx sequelize-cli db:create
```
Este comando irá fazer a conexão com o MySQL informado no `.env` e criar o banco de dados.

O comando de criação das tabelas e relacionamentos se encontra a seguir: 
```
npx sequelize-cli db:migrate
```
Este comando irá fazer a conexão com o banco de dados recém-criado e criar as tabelas através das *migrations*.

## Rodar o servidor

Para rodar o servidor localmente, em ambiente de desenvolvimento, há a possibilidade de rodar o seguinte comando:

`npm run dev` ou `yarn dev`

Este comando ativa o nodemon, que roda o servidor escutando possíveis mudanças no código.
<<<<<<< HEAD

Para rodar os testes da aplicação implementados em jest, basta, após ter criado o banco de dados e suas migrations, rodar o seguinte comando:

`npm run test` ou `yarn test`

Este comando fará os testes unitários e de integração da aplicação.
=======
>>>>>>> 64db759f5cf98bcc5d4706e2c389488f329e73fc
Caso queira somente rodar o servidor, sem a necessidade de mudar nada no código, basta rodar o comando a seguir:

`npm run start` ou `yarn start`

# Especificações do projeto
Este projeto possui algumas especificações, apresentadas em forma de requisitos funcionais a seguir:

-   Para abrir uma conta é necessário apenas o nome completo e CPF da pessoa, mas só é permitido uma conta por pessoa;
-   Com essa conta é possível realizar transferências para outras contas e depositar;
-   Não aceitamos valores negativos nas contas;
-   Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000;
-   As transferências entre contas são gratuitas e ilimitadas;

Tomando por base estes requisitos, foi idealizado o seguinte banco de dados:

|Accounts|Transfers|
|--|--|
|<table> <tr></tr><tr><td>id: integer</td></tr> <tr><td>name: string</td></tr><tr><td>cpf: string</td></tr><tr><td>password: string</td></tr><tr><td>balance: double</td></tr><tr><td>createdAt: date</td></tr><tr><td>updatedAt: date</td></tr></table>| <table> <tr></tr><tr><td>id: integer</td></tr><tr><td>sender: integer</td></tr><tr><td>receiver: integer</td></tr><tr><td>value: double </td></tr><tr><td>createdAt: date</td></tr><tr><td>updatedAt: date</td></tr> </table>|

Para melhor segurança e pensando em uma futura implementação de login, ou um sistema de tokens JWT, foi adicionado o atributo Password.

Foram implementados métodos adicionais, como mudança de senha e saque (withdrawal).