{# Welcome message that work as examples #}

<section class="js-section-{{ section_name }} js-{{ section_name }}-placeholder section-welcome-home">
    <div class="container">
        <div class="js-section-{{ section_name }}-align row text-center justify-content-center">
            <div class="col-md-7">
                <h2 class="js-{{ section_name }}-title h1-md mb-3">{{ title }}</h2>
                <p class="js-{{ section_name }}-text mb-3">{{ "Usá este texto para compartir información de tu negocio, dar la bienvenida a tus clientes o para contar lo increíble que son tus productos." | translate }}</p>
            </div>
        </div>
    </div>
</section>

{# Skeleton of "true" section accessed from instatheme.js #}
<div class="js-{{ section_name }}-top" style="display:none">    
    {% include 'snipplets/home/home-' ~ section_name ~ '.tpl' %}
</div>