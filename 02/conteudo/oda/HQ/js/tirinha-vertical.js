var img_alt = [
    "",
    "",
    "",
    "",
    "",
    "",
    ""
]

$(function () {
    var hqTED = function (el, path) {

        $(el).each(function (index, element) {
            let hq_id = "#" + $(this).attr("id");
            let hq_radical = $(this).attr("data-radical");
            let hq_quadro_inicio = $(this).attr("data-quadro-inicial");
            let hq_quadro_fim = $(this).attr("data-quadro-final");

            for (i = hq_quadro_inicio; i <= hq_quadro_fim; i++) {
                let esconder = "";
                if (i > 1) esconder = "d-none";
                $(hq_id + " .corpo").append('<img src="' + path + '/' + hq_radical + i + '.png" class="img-fluid img' + i + ' ' + esconder + '" alt="' + img_alt[i - 1] + '">');
            }
            $(hq_id).attr("data-quadro-atual", "1");
        })
    }

    $("body").on("click", ".btn-hq-proximo", function () {
        let hq_id = "#" + $(this).parents(".hq").attr("id");
        let hq_quadro_atual = $(hq_id).attr("data-quadro-atual");
        let hq_quadro_fim = $(hq_id).attr("data-quadro-final");
        if (hq_quadro_atual == (hq_quadro_fim - 1)) {
            $(this).remove();
            // Obtém a URL atual
				const url = window.location.href;
				// Cria um objeto URL para manipular
				const urlObj = new URL(url);
				// Obtém os parâmetros da URL
				const params = urlObj.searchParams;
				
                if(params.get('origem') == "blackboard") {
                    // Defina os dados a serem enviados
                    var dados = {
                        nota: "90", // Multiplicar por 2 e por 10 para obter a nota de 0 a 100
                        objeto: "odajp25",
                    };
                
                    // Chamada Ajax (exemplo para um servidor fictício)
                    $.ajax({
                        url: window.location.origin + '/AvaliacaoAlunoObjeto/Inserir', // Substitua pela URL da sua API
                        type: 'POST', // Tipo de requisição
                        data: dados, // Dados que você quer enviar
                        success: function(response){
                            alert("Dados enviados com sucesso!");
                            console.log(response);
                        },
                        error: function(error){
                            alert("Erro ao enviar os dados.");
                            console.log(error);
                        }
                    });
                } 
                
        }
        $(hq_id).attr("data-quadro-atual", ++hq_quadro_atual)
        console.log(hq_id, hq_quadro_atual)
        $(hq_id + " .corpo img").eq(--hq_quadro_atual).removeClass("d-none");

        $('html, body').animate({
            scrollTop: $(hq_id + " .corpo .img" + ++hq_quadro_atual).offset().top
        }, 'slow');

    });

    hqTED(".hq", "oda/HQ/img")


});