
# API NodeJS (ExpressJS) conectado ao MongoDB

Este projeto contem um [CRUD](https://developer.mozilla.org/pt-BR/docs/Glossary/CRUD), para controle de usuários. Desde o cadastro, login, autenticação de dois fatores com envio de e-mail, alteração de senha, e listagem de rotas privadas (que só liberam o acesso quando o usuário está autenticado na aplicação), para o controle de carros. Todas as informações conectadas ao banco de dados não relacional, MongoDB.

# Preparação

## MongoDB
Para começar a usar e testar esta API, você irá precisar criar uma imagem do [MongoDB](https://www.mongodb.com/pt-br/basics/create-database). E pegar a URL de conexão, algo parecido com isso: 
`mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]`

## Gmail
Outro passo importante para o envio do e-mail, para realizar a autenticação em dois fatores, é que iremos usar o Gmail. Você precisará criar uma conta e ativar a autenticação de dois fatores ([Clicando aqui](https://stackoverflow.com/questions/72626410/how-do-i-send-email-from-nodemailer-in-nodejs-using-gmail)) e depois criar uma senha de aplicativo, acessando [aqui](https://myaccount.google.com/apppasswords?rapt=AEjHL4PZB2jtGe1EVQ1dS_jyte5bhU_hn44yc3rDR0k3BnmcIqzmocSf5sBDIN88P8vB7-owMYAWLK6m37OyA-_2C6IE7qapTg). Então o google enviará uma senha de aplicativo que você pode fazer login com nodemailer
> Referência: https://stackoverflow.com/questions/72626410/how-do-i-send-email-from-nodemailer-in-nodejs-using-gmail


## Depois disso...
A gente vai precisar alterar o arquivo *.env*, localizado na raiz do projeto. Vamos entender um pouco mais sobre ele:

1. Nesta primeira parte do arquivo, nos temos as variáveis que ficarão responsáveis pela autenticação básica da nossa API.

        # BASIC AUTHENTICATION
	    BASIC_AUTHENTICATION_USER="CHANGE_HERE"
	    BASIC_AUTHENTICATION_PASSWORD="CHANGE_HERE"
2. Outra coisa que podemos alterar, é a URL de conexão com o MongoDB, já que ela que fara toda a conexão entre a nossa aplicação e o banco de dados. Para isso, basta alterar essa variável:

	    # BD
	    MONGO_URI="mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]"
3. E para a gente poder fazer o envio de e-mails da nossa aplicação, basta inserir o e-mail e a senha do aplicativo (disponibilizados pela a Google), aqui:

	    # NODEMAILER
	    NODEMAILER_EMAIL="CHANGE_HERE"
	    NODEMAILER_PASSWORD="CHANGE_HERE"
	    
## Nosso JSON de configuração
Temos duas informações dentro do json de configuração (localizado em: **config/default.json**).

    {
	    "server": {
		    "port": 5000
	    },
	    "APPLICATION_ID": "YOUR_APPLICATION_ID_HERE"
    }

* **port**, serve para definir a variável padrão de nossa aplicação;
* **APPLICATION_ID**, é um ID utilizado na hora da criação e validação do nosso Token JWT;

# Execusão

Após fazer o clone da aplicação, abra o terminal ou prompt de comando de sua máquina e rode:

`npm i && npm start`

Se tudo ocorrer bem, você terá um log como esse em seu terminal: 
*🔥 in http://localhost:[YOUR_SERVER_PORT_HERE]/*

**OBS**: *Não se esqueça de usar a autenticação básica no aplicativo de teste ou em sua aplicação.*
# Rotas
Dentro do código, as rotas são constituidas numa fusão entre os "controllers" e efetivamente as "rotas". Para melhor organização, dentro da pasta "api/controllers", se tem todas as funções do respectivo módulo, ou seja: **cadastro, listagem, alteração e exclusão**, caso tenha mais alguma rota, ela deve entrar aqui.
![image](https://user-images.githubusercontent.com/73892235/235822427-9b9c5eb2-9801-4161-b6e8-c7e8fb33f65b.png)

Já dentro da pasta "api/routes", fica toda a organização da rota, métodos, middlewares e a referência do arquivo controller.
![image](https://user-images.githubusercontent.com/73892235/235822466-a03b9b54-fc15-4d89-9dc0-6f4411160a62.png)

## Cadastro de usuário
## [POST] **/api/v1/newAccount**
* **Detalhe:** Rota responsável pelo o cadastro de novos usuários no banco de dados.
* **Autenticação:** false
* **Params**:

	    {
			"data": {
				"NAME": string,
				"PHONE": string,
				"EMAIL": string,
				"PASSWORD": string
			}
		}
 * **40***/**50***/**20***

	    {
		    STATUS:  boolean,
		    message:  string
	    }

## Login
## [POST] **/api/v1/checkLogin**
* **Detalhe:** Rota responsável por verificar se o usuário possui cadastro no banco, caso tenha, envia um e-mail com um token de verificação com validade de 30 minutos.
* **Autenticação:** false
* **Params**:

	    {
			"data": {
				"EMAIL": string,
				"PASSWORD": string
			}
		}
 * **40***/**50***/**20***

	    {
		    STATUS:  boolean,
		    message:  string
	    }
## [POST] **/api/v1/login**
* **Detalhe:** Após receber o token de verificação, essa rota deve ser acionada para verificar se o token enviado é válido. Caso seja, gera um token de navegação (JWT) para à aplicação front-end poder acessar as rotas restritas.
* **Autenticação:** false
* **Params**:

	    {
			"data": {
				"EMAIL": string,
				"PASSWORD": string,
				"TOKEN": string
			}
		}
* **200**

	     {
    	    STATUS:  true, 
    	    data:  {
	    	    email: string,
	    	    name: string,
	    	    token: string
    	    }
    	 }
 * **40***/**50***

	    {
		    STATUS:  false,
		    message:  string
	    }

## Alteração de senha
## [POST] **/api/v1/checkEmailToChangePassword**
* **Detalhe:** Essa rota verifica se o e-mail enviado consta na base de dados, se sim, envia um token para o e-mail cadastrado, com validade de 30 minutos. Este token será usado para fazer a troca da senha.
* **Autenticação:** false
* **Params**:

	    {
			"data": {
				"EMAIL": string
			}
		}
 * **40***/**50***/**20***

	    {
		    STATUS:  boolean,
		    message:  string
	    }
		    
## [PUT] **/api/v1/changePassword**
* **Detalhe:** Essa rota recebe o token e a nova senha do usuário. Após verificar se as senhas são idênticas e o token está valido, faz a troca da senha no banco de dados.
* **Autenticação:** false
* **Params**:

	    {
			"data": {
				"EMAIL": string,
				"TOKEN": string,
				"PASSWORD": string,
				"CONFIRM_PASSWORD": string,
			}
		}
 * **40***/**50***/**20***

	    {
		    STATUS:  boolean,
		    message:  string
	    }

## Carros
## [POST] **/api/v1/newCar**
* **Detalhe:** Essa rota recebe informações para o cadastro de carros dentro da plataforma
* **Autenticação:** true
* **Params**:

	    {
			"data": {
				"NAME": string,
				"BRAND": string,
				"YEAR": number,
				"MODEL": string
			}
		}
 * **40***/**50***/**20***

	    {
		    STATUS:  boolean,
		    message:  string
	    }
## [GET] **/api/v1/getCars**
* **Detalhe:** Lista todos os carros do usuário
* **Autenticação:** true
* **Params**: No body
 * **200**

	    {
		    STATUS:  boolean,
		    data:  {
				"_id": string,
				"NAME": string,
				"BRAND": string,
				"YEAR": number,
				"MODEL": string,
				"CREATED_AT": string
			}[]
	    }
 * **40***/**50***

	    {
		    STATUS:  boolean,
		    message:  string
	    }

## [GET] **/api/v1/getSpecificCar/:ID**
* **Detalhe:** Lista as informações de um carro em específico
* **Autenticação:** true
* **Params**: No body
 * **200**

	    {
		    STATUS:  boolean,
		    data?:  {
				"_id": string,
				"NAME": string,
				"BRAND": string,
				"YEAR": number,
				"MODEL": string,
				"CREATED_AT": string
			}
	    }
 * **40***/**50***

	    {
		    STATUS:  boolean,
		    message:  string
	    }

## [DELETE] **/api/v1/deleteCar/:ID**
* **Detalhe:** Apaga o carro com base no ID que for enviado
* **Autenticação:** true
* **Params**: No body
 * **40***/**50***/**20***

	    {
		    STATUS:  boolean,
		    message:  string
	    }

## [PUT] /api/v1/updateCar/:ID
* **Detalhe:** Essa rota recebe informações para o alterar um carro com base no ID
* **Autenticação:** true
* **Params**:

	    {
			"data": {
				"NAME": string,
				"BRAND": string,
				"YEAR": number,
				"MODEL": string
			}
		}
 * **40***/**50***/**20***

	    {
		    STATUS:  boolean,
		    message:  string
	    }
# Modelo
Dentro da pasta "api/models", se encontra todos os modelos para a construção das collections do banco de dados.
![image](https://user-images.githubusercontent.com/73892235/235822683-ed7cac84-e8f7-4267-b376-20c4a69d8d66.png)

Para fazer a adição de um novo modelo, basta criar um novo arquivo (de preferência em singular) do modelo desejado, e criar o seu esquema. Após isso, você poderá utilizar o módelo normalmente.

# Middlewares
Para a adição de novos middlewares, basta acessar a pasta "api/@helpers", adicionar o arquivo e o código necessário. Após isso, fazer a adição na rota necessária ou na aplicação como um todo.
![image](https://user-images.githubusercontent.com/73892235/235823041-0afbe33b-ac1a-4c44-9cd7-4525ef1875ce.png)

# Utils
Para funções genericas, e que possam ser uitlizadas em **N** lugares diferentes, foi criado o arquivo "api/utils". Lá dentro são funções de validação, envio de e-mail, verificação de documentos, enfim, funções que possam ser compartilhadas de forma prática e simples por toda à aplicação e evitando duplicação de códigos.

# Referências
* https://stackoverflow.com/questions/12921658/use-specific-middleware-in-express-for-all-paths-except-a-specific-one
* https://www.mongodb.com/docs/v6.0/reference/
* https://www.youtube.com/@Sujeitoprogramador/featured

# Suporte
Se você tiver algum problema ou dúvida, sinta-se à vontade para abrir uma **issue** neste repositório.

# Contribuição
Contribuições são bem-vindas! Se você deseja melhorar este projeto, siga estas etapas:

1. Faça um fork deste repositório.
2. Crie uma nova branch: "**git checkout -b minha-branch**".
3. Faça suas modificações e commit: "**git commit -m 'Minhas alterações'**".
4. Envie para o repositório remoto: "**git push origin minha-branch**".
5. Abra uma **pull request** explicando suas alterações.

# Licença
Este projeto está licenciado sob a MIT License. Sinta-se livre para usá-lo da maneira que preferir.
