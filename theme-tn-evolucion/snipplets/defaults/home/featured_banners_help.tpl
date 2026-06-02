{# Categories banners that work as examples #}

<section data-store="home-banner-featured">
    <div class="section-banners-home" data-transition="fade-in-up">
        <div class="container">
            <div class="row row-grid">
                <div class="col-grid col-md-7">
                    <div class="textbanner">
                        <div class="textbanner-image overlay textbanner-image-empty textbanner-featured-big">
                        </div>
                        <div class="textbanner-text over-image">
                            <div class="h1-huge-md h2 mb-2">{{ 'Oferta destacada' | translate }}</div>
                        </div>
                        <div class="placeholder-overlay transition-soft">
                            <div class="placeholder-info">
                                {% include "snipplets/svg/edit.tpl" with {svg_custom_class: "icon-inline icon-3x"} %}
                                <div class="placeholder-description font-small-xs">
                                    {{ "Podés destacar ofertas de tu tienda desde" | translate }} <strong>"{{ "Banners destacados" | translate }}"</strong>
                                </div>
                                {% if not params.preview %}
                                    <a href="{{ admin_link }}#instatheme=pagina-de-inicio" class="btn-primary btn btn-small placeholder-button">{{ "Editar" | translate }}</a>
                                {% endif %}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-grid col-md-5">
                    <div class="row row-grid">
                        <div class="col-grid col-md-12">
                            <div class="textbanner">
                                <div class="textbanner-image overlay textbanner-image-empty textbanner-featured-small">
                                </div>
                                <div class="textbanner-text over-image">
                                    <div class="h2-md h3 mb-1">{{ 'Oferta destacada' | translate }}</div>
                                </div>
                                <div class="placeholder-overlay transition-soft">
                                    <div class="placeholder-info p-2">
                                        <div class="placeholder-description font-small-xs my-2">
                                            {{ "Podés destacar ofertas de tu tienda desde" | translate }} <strong>"{{ "Banners destacados" | translate }}"</strong>
                                        </div>
                                        {% if not params.preview %}
                                            <a href="{{ admin_link }}#instatheme=pagina-de-inicio" class="btn-primary btn btn-small placeholder-button">{{ "Editar" | translate }}</a>
                                        {% endif %}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-grid col-md-12">
                            <div class="textbanner">
                                <div class="textbanner-image overlay textbanner-image-empty textbanner-featured-small">
                                </div>
                                <div class="textbanner-text over-image">
                                    <div class="h2-md h3 mb-1">{{ 'Oferta destacada' | translate }}</div>
                                </div>
                                <div class="placeholder-overlay transition-soft">
                                    <div class="placeholder-info p-2">
                                        <div class="placeholder-description font-small-xs my-2">
                                            {{ "Podés destacar ofertas de tu tienda desde" | translate }} <strong>"{{ "Banners destacados" | translate }}"</strong>
                                        </div>
                                        {% if not params.preview %}
                                            <a href="{{ admin_link }}#instatheme=pagina-de-inicio" class="btn-primary btn btn-small placeholder-button">{{ "Editar" | translate }}</a>
                                        {% endif %}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-grid col-md-12">
                            <div class="textbanner">
                                <div class="textbanner-image overlay textbanner-image-empty textbanner-featured-small">
                                </div>
                                <div class="textbanner-text over-image">
                                    <div class="h2-md h3 mb-1">{{ 'Oferta destacada' | translate }}</div>
                                </div>
                                <div class="placeholder-overlay transition-soft">
                                    <div class="placeholder-info p-2">
                                        <div class="placeholder-description font-small-xs my-2">
                                            {{ "Podés destacar ofertas de tu tienda desde" | translate }} <strong>"{{ "Banners destacados" | translate }}"</strong>
                                        </div>
                                        {% if not params.preview %}
                                            <a href="{{ admin_link }}#instatheme=pagina-de-inicio" class="btn-primary btn btn-small placeholder-button">{{ "Editar" | translate }}</a>
                                        {% endif %}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
