import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProdutoService } from './service/produto.service';
import { Produto } from './model/produto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  

  produtos: Produto[] = [];
  produtoForm = this.fb.group({
    id: [],
    nome: [null, Validators.required],
    valor: [null, Validators.required],
    descricao:[]
  })
  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService
  ){

    this.buscarProdutos();
  }

  buscarProdutos(){

    this.produtoService.buscarTodos().subscribe({
      next: (res)=>{
        this.produtos = res;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  criarProduto(): Produto{

    return {
      id: this.produtoForm.get('id')?.value || 0,
      nome: this.produtoForm.get('nome')?.value || '',
      valor: this.produtoForm.get('valor')?.value || 0,
      descricao: this.produtoForm.get('descricao')?.value ||'' ,
    }
  }
  salvar() {

    if(this.produtoForm.valid){

      const produto = this.criarProduto();
    console.log('produto',produto);

    this.produtoService.salvar(produto).subscribe(
      {
      next: (res) =>{
        this.produtoForm.reset();
        this.buscarProdutos();
        alert("produto salvo com sucesso")
      },

      error:(error)=>{

        console.log(error);
      }
    });
    }
    
  }
  remover(produto: Produto){
    const confirmacao = confirm("Qurer realmente excluir esse produto?" +produto.nome);
   
    if(confirmacao){
      const id= produto.id ?? 0;
      this.produtoService.remover(id).subscribe({
        next: (res)=>{
          this.buscarProdutos();
          alert("Produto removido com sucesso")
        },
        error:(error) =>{
          console.log(error);
        }
      })
    }
  }
}
