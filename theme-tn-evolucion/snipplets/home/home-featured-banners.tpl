{% set has_banner_01 = settings.banner_01_show and (settings.banner_01_title or settings.banner_01_description or "banner_01.jpg" | has_custom_image) %}
{% set has_banner_02 = settings.banner_02_show and (settings.banner_02_title or settings.banner_02_description or "banner_02.jpg" | has_custom_image) %}
{% set has_banner_03 = settings.banner_03_show and (settings.banner_03_title or settings.banner_03_description or "banner_03.jpg" | has_custom_image) %}
{% set has_banner_04 = settings.banner_04_show and (settings.banner_04_title or settings.banner_04_description or "banner_04.jpg" | has_custom_image) %}

{% if has_banner_01 or has_banner_02 or has_banner_03 or has_banner_04 %}
    <section data-store="home-banner-featured">
        <div class="section-banners-home" data-transition="fade-in-up">
            <div class="container">
                <div class="row row-grid">
                    {% set num_banners = 0 %}
                    {% for banner in ['banner_01', 'banner_02', 'banner_03', 'banner_04'] %}
                        {% set banner_show = attribute(settings,"#{banner}_show") %}
                        {% set banner_title = attribute(settings,"#{banner}_title") %}
                        {% set banner_description = attribute(settings,"#{banner}_description") %}
                        {% set banner_button_text = attribute(settings,"#{banner}_button") %}
                        {% set has_banner =  banner_show and (banner_title or banner_description or "#{banner}.jpg" | has_custom_image) %}
                        {% if has_banner %}
                            {% set num_banners = num_banners + 1 %}
                        {% endif %}
                    {% endfor %}

                    {% for banner in ['banner_01', 'banner_02', 'banner_03', 'banner_04'] %}
                        {% set banner_show = attribute(settings,"#{banner}_show") %}
                        {% set banner_image = "#{banner}.jpg" | has_custom_image %}
                        {% set banner_image_static_url = "#{banner}.jpg" | static_url %}
                        {% set banner_title = attribute(settings,"#{banner}_title") %}
                        {% set banner_description = attribute(settings,"#{banner}_description") %}
                        {% set banner_button_text = attribute(settings,"#{banner}_button") %}
                        {% set banner_url = attribute(settings,"#{banner}_url") %}
                        {% set has_banner = banner_show and (banner_title or banner_description or "#{banner}.jpg" | has_custom_image) %}
                        {% set has_banner_text = banner_title or banner_description or banner_url and banner_button_text %}
                        {% set banner_big = loop.first or num_banners == 2 %}
                        {% if has_banner %}

                            {% if (num_banners == 4 or num_banners == 3) and loop.index == 2 %}
                                <div class="col-grid col-md-5">
                                    <div class="row row-grid">
                            {% endif %}
                            <div class="col-grid col-md{% if (num_banners == 2 or num_banners == 3 or num_banners == 4) and loop.first %}-7{% elseif num_banners == 2 and loop.index == 2 %}-5{% else %}-12{% endif %}">
                                <div class="textbanner">
                                    {% if banner_url %}
                                        <a class="textbanner-link" href="{{ banner_url | setting_url }}"{% if banner_title %} title="{{ banner_title }}" aria-label="{{ banner_title }}"{% else %} title="{{ 'Banner de' | translate }} {{ store.name }}" aria-label="{{ 'Banner de' | translate }} {{ store.name }}"{% endif %}>
                                    {% endif %}
                                    {% if banner_image %}
                                        <div class="textbanner-image p-0">

                                            {% set has_featured_banners_first = settings.home_order_position_1 == 'featured_banners' %}
                                            {% set apply_lazy_load = not has_featured_banners_first or (has_featured_banners_first and not loop.first and settings.banner_01_show and "banner_01.jpg" | has_custom_image) %}

                                            {% if apply_lazy_load %}
                                                {% set image_src = banner_image_static_url | settings_image_url('tiny') %}
                                            {% else %}
                                                {% set image_src = banner_image_static_url | settings_image_url('large') %}
                                            {% endif %}

                                            <img class="textbanner-image-effect img-fluid d-block w-100 lazyautosizes lazyload fade-in" src='{{ image_src }}' {% if apply_lazy_load %}data-sizes="auto" data-expand="-10" data-{% endif %}srcset='{{ banner_image_static_url | settings_image_url('large') }} 480w, {{ banner_image_static_url | settings_image_url('huge') }} 640w, {{ banner_image_static_url | settings_image_url('original') }} 1024w, {{ banner_image_static_url | settings_image_url('1080p') }} 1920w' {% if banner_title %}alt="{{ banner_title }}"{% else %}alt="{{ 'Banner de' | translate }} {{ store.name }}"{% endif %} />
                                            <div class="placeholder-fade placeholder-banner"></div>
                                        </div>
                                    {% endif %}
                                    {% if has_banner_text %}
                                        <div class="textbanner-text over-image over-image-invert{% if not banner_image %} position-relative{% endif %}">
                                            {% if banner_title %}
                                                <div class="{% if banner_big %}h1-huge-md h2 mb-2{% else %}h2-md h3 mb-1{% endif %}">{{ banner_title }}</div>
                                            {% endif %}
                                            {% if banner_description %}
                                                <div class="textbanner-paragraph font-small font-md-body{% if banner_url and banner_button_text %} mb-md-2 mb-1{% endif %}">{{ banner_description }}</div>
                                            {% endif %}
                                            {% if banner_url and banner_button_text %}
                                                <div class="btn btn-default btn-smallest {% if banner_big %}mt-2{% else %}mt-1{% endif %}">{{ banner_button_text }}</div>
                                            {% endif %}
                                        </div>
                                    {% endif %}
                                    {% if banner_url %}
                                        </a>
                                    {% endif %}
                                </div>
                            </div>
                            {% if (num_banners == 4 and loop.index == 4) or (num_banners == 3 and loop.index == 3) %}
                                    </div>
                                </div>
                            {% endif %}

                        {% endif %}
                    {% endfor %}
                </div>
            </div>
        </div>
    </section>
{% endif %}
