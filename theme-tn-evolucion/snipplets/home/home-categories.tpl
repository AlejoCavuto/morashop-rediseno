{% if settings.main_categories and settings.slider_categories and settings.slider_categories is not empty %}
    <section class="section-categories-home position-relative" data-store="home-categories-featured">
        <div class="container">
            <div class="row align-items-center">
                {% if settings.main_categories_title %}
                    <div class="col-md-2">
                        <h2 class="h6 mb-3 mb-md-0">{{ settings.main_categories_title }}</h2>
                    </div>
                {% endif %}
                <div class="{% if settings.main_categories_title %}col-md-10{% else %}col-12{% endif %}">
                    <div class="js-swiper-categories swiper-container w-auto mx-4 m-md-0">
                        <div class="swiper-wrapper">
                            {% for slide in settings.slider_categories %}
                                <div class="swiper-slide w-md-auto">
                                    {% if slide.link %}
                                        <a href="{{ slide.link | setting_url }}" class="js-home-category" aria-label="{{ 'Categoría' | translate }} {{ loop.index }}">
                                    {% endif %}
                                        <div class="home-category text-center">
                                            <div class="home-circle-image home-circle-image-md">
                                                <img src="{{ 'images/empty-placeholder.png' | static_url }}" data-src="{{ slide.image | static_url | settings_image_url('small') }}" class="swiper-lazy" alt="{{ 'Categoría' | translate }} {{ loop.index }}">
                                                <div class="placeholder-fade"></div>
                                            </div>
                                    {% if slide.link %}
                                                {% set category_handle = slide.link | trim('/') | split('/') | last %}
                                                {% include 'snipplets/home/home-categories-name.tpl' %}
                                            </div>
                                        </a>
                                    {% else %}
                                        </div>
                                    {% endif %}
                                </div>
                            {% endfor %}
                        </div>
                    </div>
                    <div class="js-swiper-categories-prev swiper-button-prev swiper-button-outside svg-icon-text">{% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
                    <div class="js-swiper-categories-next swiper-button-next swiper-button-outside svg-icon-text">{% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
                </div>
            </div>
        </div>
    </section>
{% endif %}
