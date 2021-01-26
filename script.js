let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (el)=> document.querySelector(el);
const cs = (el)=> document.querySelectorAll(el);

//Listagem das pizzas
pizzaJson.map((item, index)=>{
	let pizzaItem = c('.models .pizza-item').cloneNode(true);
	//preencher as informações em pizza-item

	pizzaItem.setAttribute('data-key',index);
	pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
	pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
	pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
	pizzaItem.querySelector('.pizza-item--img img ').src = item.img;

	pizzaItem.querySelector('a').addEventListener('click',(e)=>{
		e.preventDefault();
		let key= e.target.closest('.pizza-item').getAttribute('data-key');
		modalKey= key;

		modalQt=1;

		c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
		c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
		c('.pizzaBig img').src = pizzaJson[key].img;

		//preenchendo preço do modal
		c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

		//resetando o peso selecionado 
		c('.pizzaInfo--size.selected').classList.remove('selected');

		//preenchendo o peso de cada tamanho de pizza
		cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
			/* selecionando automaticamente o de maior peso */
			if(sizeIndex == 2) {
				size.classList.add('selected');
			}
			size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

		});

		c('.pizzaInfo--qt').innerHTML = modalQt;


		//CONFIGURANDO A OPACIDADE DO MODAL
		c('.pizzaWindowArea').style.opacity = 0;	
		c('.pizzaWindowArea').style.display = 'flex';
		setTimeout(()=>{
			c('.pizzaWindowArea').style.opacity = 1;
		},200);
		
	});
	
	c('.pizza-area').append(pizzaItem);



});


//Eventos do MODAL

/* FUNÇÃO PARA FECHAR O MODAL */
function closeModal(){
	c('.pizzaWindowArea').style.opacity = 0;
	setTimeout(()=>{
		c('.pizzaWindowArea').style.display = 'none';
	},500);
}

cs('.pizzaInfo--cancelButton,pizzaInfo--cancelMobileButton').forEach((item)=>{
	item.addEventListener('click', closeModal)
});


//QUANTIDADE DE PIZZAS
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
	if (modalQt > 1){
		modalQt--;
		c('.pizzaInfo--qt').innerHTML = modalQt;
	}
	

});

c('.pizzaInfo--qtmais').addEventListener('click',()=>{
	modalQt++;
	c('.pizzaInfo--qt').innerHTML = modalQt;

});


//preenchendo o peso de cada tamanho de pizza
		cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
			size.addEventListener('click',(e)=>{
				//resetando o peso selecionado 
				c('.pizzaInfo--size.selected').classList.remove('selected');
				size.classList.add('selected');
			});	

		});


//adicionar carrinho
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
	/*
	//Qual a pizza ? 
		console.log("PIZZA:" + modalKey);  //JA TEMOS ESSA INFORMAÇÃO */

	/*
	//Quantas pizzas vao ser adicionadas ?
		console.log("QUANTIDADE DE PIZZAS:" + modalQt); Ja temos essa informação no modalQt */


	//Qual o tamanho selecionado ? 
		let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key')); //tamanho da pizza
		

	let identifier = pizzaJson[modalKey].id + '@' + size;

	let key = cart.findIndex((item)=> item.identifier == identifier);

		if (key > -1) {
			cart[key].qt += modalQt;
		} else{
				cart.push({
				identifier,
				id:  pizzaJson[modalKey].id,
				tamanho:size,
				qt:modalQt
		});	
	}

	updateCart();	

	closeModal();
});

//função para abrir o aside no mobile se tiver pelo menos 1 item adicionado no carrinho
c('.menu-openner').addEventListener('click',()=>{
	if(cart.length > 0){
		c('aside').style.left = '0';
	}
});

c('.menu-closer').addEventListener('click',()=>{
	c('aside').style.left = '100vw';
})

function updateCart(){

	c('.menu-openner span').innerHTML =  cart.length;


	if (cart.length > 0) {
		c('aside').classList.add('show');
		c('.cart').innerHTML = '' ;

		let subtotal = 0;
		let desconto = 0;
		let total = 0;

		for(let i in cart){

			let pizzaItem = pizzaJson.find((item)=>{
				return item.id==cart[i].id;
			});

			//calculando o subtotal
			subtotal += pizzaItem.price * cart[i].qt;

			let cartItem = c('.models .cart--item').cloneNode(true);
			
			//mostrando no aside o tamanho da pizza adicionada ao carrinho
			let pizzaSizeName;

			switch(cart[i].tamanho){
				case 0:
					pizzaSizeName = 'P';
					break;
				case 1:
					pizzaSizeName = 'M';
					break;

				case 2:
					pizzaSizeName = 'G';
					break;	
			}


			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

			cartItem.querySelector('img').src = pizzaItem.img;
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;


			//botoes de adicionar e remover quantidades dentro do carrinho
			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
				if(cart[i].qt > 1){
					cart[i].qt--;
				}else{
					cart.splice(i,1);
				}
				updateCart();
			});

			cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
				cart[i].qt++;
				updateCart();
			});

			c('.cart').append(cartItem);

		}

		desconto = subtotal * 0.1;
		total= subtotal- desconto;

		c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
		c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
		c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


	}else {
		c('aside').classList.remove('show');
		c('aside').style.left = '100vw';
	}
}