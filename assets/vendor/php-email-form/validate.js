/**
* Form Validation for Netlify Forms
* Compatível com Netlify Forms - Sem necessidade de PHP
*/

(function() {
  "use strict";

  // Aguardar o DOM carregar completamente
  document.addEventListener('DOMContentLoaded', function() {
    
    // Selecionar apenas formulários com a classe php-email-form que têm o atributo netlify
    let forms = document.querySelectorAll('.php-email-form[netlify]');
    
    forms.forEach(function(form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obter elementos de feedback
        let loading = form.querySelector('.loading');
        let errorDiv = form.querySelector('.error-message');
        let sentDiv = form.querySelector('.sent-message');
        
        // Resetar mensagens
        if (loading) loading.classList.remove('d-none');
        if (errorDiv) {
          errorDiv.classList.add('d-none');
          errorDiv.innerHTML = '';
        }
        if (sentDiv) sentDiv.classList.add('d-none');
        
        // Criar FormData com os dados do formulário
        let formData = new FormData(form);
        
        // Adicionar campo hidden para o Netlify (garantia)
        if (!formData.has('form-name')) {
          formData.append('form-name', form.getAttribute('name') || 'contact');
        }
        
        // Enviar para o Netlify
        fetch('/', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(function(response) {
          if (response.ok) {
            if (loading) loading.classList.add('d-none');
            if (sentDiv) sentDiv.classList.remove('d-none');
            form.reset();
            
            // Esconder mensagem de sucesso após 5 segundos
            setTimeout(function() {
              if (sentDiv) sentDiv.classList.add('d-none');
            }, 5000);
          } else {
            throw new Error('Erro ao enviar mensagem. Status: ' + response.status);
          }
        })
        .catch(function(error) {
          if (loading) loading.classList.add('d-none');
          if (errorDiv) {
            errorDiv.innerHTML = error.message || 'Erro ao enviar mensagem. Tente novamente mais tarde.';
            errorDiv.classList.remove('d-none');
          }
          
          // Esconder mensagem de erro após 5 segundos
          setTimeout(function() {
            if (errorDiv) errorDiv.classList.add('d-none');
          }, 5000);
        });
        
      });
    });
    
  });
  
})();