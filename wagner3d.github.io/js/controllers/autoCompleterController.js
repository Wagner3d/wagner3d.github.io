angular.module('app').controller('autoCompleterController',function(usersAPI,$timeout,$window,$interval){
	self = this;

	self.listaPessoasTotalGit = [];
	self.pesquisasRealizadas = ["",undefined];
	self.listaPessoasEncontradas = [];
	self.selectedIndex = -1;
	self.pessoa = {
		nome: "",
		login: ""
	};

	//procurar pessoas no arrayList e povoa o auto-complete
	self.procurarPessoa = function(){
		self.listaPessoasEncontradas = [];
		var numeroMaxPessoas = 0;
		for(var i=0; i < self.listaPessoasTotalGit.length; i++){
		 	var p = angular.lowercase(self.listaPessoasTotalGit[i].nome);
			var nomeProc = angular.lowercase(self.pessoa.nome);
			if(p.startsWith(nomeProc)){
				self.listaPessoasEncontradas.push(self.listaPessoasTotalGit[i]);
				numeroMaxPessoas += 1;
				if(numeroMaxPessoas == 6){ //limitar a qtd de pessoas visiveis
					break;
				}
			}
		};
		
	}

	//clicou no nome do auto-complete = mostrar dados do usuário
	self.selecionouONome = function(index){
		//setando o texto clicado no input e limpando o auto-complete
		angular.copy(self.listaPessoasEncontradas[index],self.pessoa)
		self.listaPessoasEncontradas = [];
		self.selectedIndex = -1;
		if(!containsPequisasInPequisasRealizadas(self.pessoa.nome)){
			self.pesquisasRealizadas.push(self.pessoa.nome);
		}
		
		usersAPI.getUser(self.pessoa.login).then(function(response) {

			var usuario = response.data;
						console.log(usuario);
            var avatar_url = usuario['avatar_url'];
							var nome = usuario['name'];
							var user_url = usuario['html_url'];
							var login = usuario['login'];
							var email = usuario['email'];
							var followers = usuario['followers'];
							var following = usuario['following'];
							
							var div1 = document.createElement("div");
							div1.className = "col-md-12";
							//div1.setAttribute("style", "height:400px");
							var div2 = document.createElement("div");
							div2.className = "block thumbnail";
							var img = document.createElement("img");
							img.className = "img-responsive";
							img.setAttribute("src", avatar_url);
							var div3 = document.createElement("div");
							div3.className = "caption";
							var h1 = document.createElement("h1");
							h1.innerHTML = nome;
							var p1 = document.createElement("h4");
							p1.innerHTML = "login: " + $.trim(login);
							if($.trim(email)){
								var p2 = document.createElement("h4");
								p2.innerHTML = "email: " + "Restrito";
							}else{
								var p2 = document.createElement("h4");
								p2.innerHTML = "email: " + $.trim(email);
							}
							var p3 = document.createElement("h4");
							p3.innerHTML = "followers: " + $.trim(followers);
							var p4 = document.createElement("h4");
							p4.innerHTML = "following: " + $.trim(following);
							var br = document.createElement("br");
							var link1 = document.createElement("a");
							link1.className = "btn";
							link1.innerHTML = "VISITE-ME";
							link1.setAttribute("href", user_url);
							
							div1.appendChild(div2);
							div2.appendChild(img);
							div2.appendChild(div3);
							div3.appendChild(h1);
							div3.appendChild(p1);
							

							var p2 = document.createElement("h4");
							p2.innerHTML = "email: " + $.trim(email);	
							div3.appendChild(p3);
							div3.appendChild(p4);
							div3.appendChild(br);
							div3.appendChild(link1);															
							document.getElementById("divUsuarios2").appendChild(div1);
        })		 
	};
	
	//a cada 1s ele executa essa função para buscar mais usuarios e atualizar o autocomplete
	$interval(
	function(){
		let nomeProc = self.pessoa.nome;
		if(!containsPequisasInPequisasRealizadas(nomeProc)){ // só pesquisa de novo se a palavra não foi encontrada no array de pesquisas realizadas
			self.pesquisasRealizadas.push(nomeProc);
			usersAPI.getUsers(nomeProc).then(function(response) {
				//guardando a lista de usuário da pesquisa
				let userAPI = response.data.items.map(function(userApi){
					return {
					nome: userApi.text_matches[0].fragment,
					login: userApi.login 
					}
				});
				for(let i = 0; i < userAPI.length; i++){ // pode ser que isso fique lento, se ficar, tentar não armazenar esses cache
					inserirPessoaNoArraySemRepeticao(self.listaPessoasTotalGit,userAPI[i])
				}
				self.procurarPessoa(); // atualiza a lista do auto-complete, se implementar o filter isso não será nescessário			
			});
		}
	}, 1000);
		
		
	let inserirPessoaNoArraySemRepeticao = function(pArray, p){
		pessoaEncontrada = false;
		for(let i = 0; i < pArray.length; i++){
			if(pArray[i].login == p.login){
				pessoaEncontrada = true;
			}
		}
		if(!pessoaEncontrada){
			pArray.push(p);
		}
	}
	
	let containsPequisasInPequisasRealizadas = function(nomeProc){
		let palavraJaFoiProcurada = false;
		if(typeof nomeProc == ""){ //verifica se foi preenchida
			palavraJaFoiProcurada = true;
		}
		for (let i = 0; i < self.pesquisasRealizadas.length; i++){
			if(self.pesquisasRealizadas[i] == nomeProc){ //verifica se a pesquisa ja foi feita para não realiza-la novamente, se for objeto testar o angular.equals
				palavraJaFoiProcurada = true;
			}			
		}
		return palavraJaFoiProcurada;
	}
	
	
	
});
