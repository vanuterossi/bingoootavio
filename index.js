var jogadores = [];
var intervalo;
var sorteioEmAndamento = false;
var numerosCartela = [];

function gerarNumerosAleatorios(quantidade, min, max) {
  if (quantidade > max - min) {
    console.log("Intervalo insuficiente ...");
    return;
  }

  var numeros = [];

  while (numeros.length < quantidade) {
    var aleatorio = Math.floor(Math.random() * (max - min) + min);

    if (!numeros.includes(aleatorio)) {
      numeros.push(aleatorio);
    }
  }

  return numeros;
}

function gerarCartela() {
  if (sorteioEmAndamento) {
    alert("A criação das cartelas não é permitida durante o sorteio de números.");
    return;
  }

  var nomeJogador = prompt("Digite o nome do jogador:");

  if (!nomeJogador || nomeJogador.trim() === "") {
    alert("Não é possível gerar a cartela sem o nome do jogador.");
    return;
  }

  var regex = /^[A-Za-zÀ-ú]+$/;
  if (!regex.test(nomeJogador)) {
    alert("O nome do jogador deve conter apenas letras.");
    return;
  }

  var jogadorExistente = jogadores.find(function(jogador) {
    return jogador.nomeJogador === nomeJogador;
  });

  if (jogadorExistente) {
    alert("Já existe um jogador com esse nome. Escolha um nome diferente.");
    return;
  }

  var cartela = [
    gerarNumerosAleatorios(5, 1, 15),
    gerarNumerosAleatorios(5, 16, 30),
    gerarNumerosAleatorios(5, 31, 45),
    gerarNumerosAleatorios(5, 46, 60),
    gerarNumerosAleatorios(5, 61, 75)
  ];

  jogadores.push({
    nomeJogador: nomeJogador,
    cartela: cartela
  });

  desenharCartela(nomeJogador, cartela);

  console.log(jogadores);
}

function desenharCartela(nome, cartela) {
  var div = document.getElementById("espaco-cartelas");

  var jogadorDiv = document.createElement("div");
  jogadorDiv.classList.add("jogador");

  var nomeJogadorDiv = document.createElement("h3");
  nomeJogadorDiv.innerText = nome;
  jogadorDiv.appendChild(nomeJogadorDiv);

  var tabela = document.createElement("table");
  tabela.classList.add("cartela");

  var thead = document.createElement("thead");

  var thB = document.createElement("th");
  thB.innerText = "B";
  var thI = document.createElement("th");
  thI.innerText = "I";
  var thN = document.createElement("th");
  thN.innerText = "N";
  var thG = document.createElement("th");
  thG.innerText = "G";
  var thO = document.createElement("th");
  thO.innerText = "O";

  thead.appendChild(thB);
  thead.appendChild(thI);
  thead.appendChild(thN);
  thead.appendChild(thG);
  thead.appendChild(thO);

  for (var i = 0; i < 5; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < 5; j++) {
      var td = document.createElement("td");
      if (i === 2 && j === 2) {
        td.innerText = "X";
        tr.appendChild(td);
      } else {
        td.innerText = cartela[j][i];
        tr.appendChild(td);
      }
    }
    tabela.appendChild(tr);
  }

  tabela.appendChild(thead);
  jogadorDiv.appendChild(tabela);
  div.appendChild(jogadorDiv);
}

function iniciarJogo() {
  if (jogadores.length < 2) {
    alert("É necessário pelo menos dois jogadores para iniciar o jogo.");
    return;
  }

  if (sorteioEmAndamento) {
    alert("O sorteio dos números já está em andamento.");
    return;
  }

  if (jogadores.length === 0) {
    alert("É preciso criar as cartelas antes de iniciar o jogo.");
    return;
  }

  sorteioEmAndamento = true;

  var numerosCartelaDiv = document.getElementById("numeros-sorteados");
  numerosCartelaDiv.innerHTML = "";

  numerosCartela = [];
  var numeroSorteado = 0;
  intervalo = setInterval(function() {
    do {
      numeroSorteado = Math.floor(Math.random() * 75) + 1;
    } while (numerosCartela.includes(numeroSorteado));

    numerosCartela.push(numeroSorteado);
    numerosCartelaDiv.innerHTML += "<div class='numero-sorteado'>" + numeroSorteado + "</div>";

    marcarNumeroSorteado(numeroSorteado);

    var ganhadores = verificarGanhadores();

    if (ganhadores.length > 0) {
      clearInterval(intervalo);
      var nomesGanhadores = ganhadores.map(function(jogador) {
        return jogador.nomeJogador;
      });
      alert("Os jogadores vencedores são: " + nomesGanhadores.join(", "));
      sorteioEmAndamento = false;
      alert("O jogo acabou. Reiniciando.")
      setTimeout(function() {
        reiniciarJogo();
      }, 2500); 
}

    if (numerosCartela.length === 75) {
      clearInterval(intervalo);

      if (ganhadores.length === 0) {
        alert("Não houve ganhadores. O jogo terminou.");
      }

      sorteioEmAndamento = false;
    }
  }, 100);
}

function reiniciarJogo() {
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
    console.log("Sorteio dos números interrompido.");
  }

  jogadores = [];
  numerosCartela = [];

  var numerosCartelaDiv = document.getElementById("numeros-sorteados");
  numerosCartelaDiv.innerHTML = "";

  var espacoCartelasDiv = document.getElementById("espaco-cartelas");
  espacoCartelasDiv.innerHTML = "";

  console.log("Jogo reiniciado.");

  sorteioEmAndamento = false;
}

function marcarNumeroSorteado(numero) {
  var cartelas = document.getElementsByClassName("cartela");

  for (var i = 0; i < cartelas.length; i++) {
    var celulas = cartelas[i].getElementsByTagName("td");

    for (var j = 0; j < celulas.length; j++) {
      if (celulas[j].innerText === numero.toString()) {
        celulas[j].classList.add("sorteado");
      }
    }
  }
}

function verificarGanhadores() {
  var ganhadores = [];

  if (numerosCartela.length < 25) {
    return ganhadores;
  }

  jogadores.forEach(function(jogador) {
    var ganhou = true;

    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        if (!numerosCartela.includes(jogador.cartela[i][j])) {
          ganhou = false;
          break;
        }
      }

      if (!ganhou) {
        break;
      }
    }

    if (ganhou) {
      ganhadores.push(jogador);
    }
  });

  return ganhadores;
}