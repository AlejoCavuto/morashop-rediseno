{% if settings.show_instafeed and store.instagram and store.hasInstagramToken() %}
    <section class="section-instafeed-home overflow-none py-2 py-md-4" data-store="home-instagram-feed">
        <div class="container">
            <div class="row align-items-center">
                {% set instuser = store.instagram|split('/')|last %}
                <div class="col-md-2">
                    <a target="_blank" href="{{ store.instagram }}" class="mb-0" aria-label="{{ 'Instagram de' | translate }} {{ store.name }}">
                        <div class="instafeed-title my-3 m-md-0">
                            <h2 class="h6 font-body mb-0">{% include "snipplets/svg/instagram.tpl" with {svg_custom_class: "icon-inline icon-lg mr-2 svg-icon-text"} %} {{ instuser }}</h2>
                            {# Instagram fallback info in case feed fails to load #}
                            <div class="js-ig-fallback">
                                <p class="btn-link font-small mt-3 mb-0">{{ 'Ver perfil' | translate }}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="col-md-10">
                    {% if store.hasInstagramToken() %}
                        <div class="js-ig-success row row-grid"
                            data-ig-feed
                            data-ig-items-count="6"
                            data-ig-item-class="col-4 col-grid col-md-2"
                            data-ig-link-class="instafeed-link m-md-0"
                            data-ig-image-class="instafeed-img w-100 fade-in"
                            data-ig-aria-label="{{ 'Publicación de Instagram de' | translate }} {{ store.name }}"
                            style="display: none;">
                        </div>
                    {% endif %}
                </div>
            </div>
        </div>
    </section>
{% endif %}