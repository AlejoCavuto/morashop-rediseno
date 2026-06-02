{% if settings.video_embed %}
    <section class="js-section-video section-video-home position-relative" data-store="home-video" data-transition="fade-in">
        {% set has_video_text = settings.video_title or settings.video_subtitle or settings.video_text or (settings.video_button and settings.video_button_url)  %}
        <div class="js-home-video-container lazyload home-video embed-responsive embed-responsive-16by9{% if settings.video_vertical_mobile %} embed-responsive-1by1{% endif %} position-relative{% if settings.video_type == 'autoplay' %} home-video-autoplay {% if has_video_text %}home-video-overlay{% endif %}{% endif %}">
            {% if settings.video_type == 'sound' %}
                <a href="#" class="js-play-button video-player">
                    <div class="video-player-icon">{% include "snipplets/svg/play.tpl" with {svg_custom_class: "icon-inline icon-xs svg-icon-text icon-xs"} %}</div>
                </a>
            {% endif %}
            {% set has_video_first = settings.home_order_position_1 == 'video' %}
            {% if has_video_first or settings.video_type == 'sound' %}
                <div class="js-home-video-image{% if has_video_first and settings.video_type == 'autoplay' %} d-block d-md-none{% endif %}">
                    {% set custom_video_image = "video_image.jpg" | has_custom_image %}
                    {% if custom_video_image %}
                        {% set video_image_static_url = "video_image.jpg" | static_url %}
                        {% set video_image_src = video_image_static_url | settings_image_url("large") %}
                    {% else %}
                        {% set video_url = settings.video_embed %}
                        {% if '/watch?v=' in settings.video_embed %}
                            {% set video_format = '/watch?v=' %}
                        {% elseif '/youtu.be/' in settings.video_embed %}
                            {% set video_format = '/youtu.be/' %}
                        {% elseif '/shorts/' in settings.video_embed %}
                            {% set video_format = '/shorts/' %}
                        {% endif %}
                        {% set video_id = video_url|split(video_format)|last %}
                        {% set video_image_src = 'https://img.youtube.com/vi_webp/' ~ video_id ~ '/maxresdefault.webp' %}
                    {% endif %}
                    <img class="home-video-image{% if not has_video_first %} lazyload{% endif %}" {% if not has_video_first %}data-{% endif %}src='{{ video_image_src }}'{% if custom_video_image %} {% if not has_video_first %}data-{% endif %}srcset='{{ video_image_static_url | settings_image_url("original") }} 1024w, {{ video_image_static_url | settings_image_url("1080p") }} 1920w'{% endif %} alt="{{ 'Video de' | translate }} {{ store.name }}" />
                    {% if settings.video_type == 'autoplay' %}
                        <div class="placeholder-shine placeholder-shine-invert"></div>
                    {% endif %}
                </div>
            {% endif %}
            <div class="js-home-video" id="player"></div>
            {% if settings.video_type == 'autoplay' %}
                <div class="home-video-hide-controls"></div>
            {% endif %}
        </div>
        {% if has_video_text %}
            <div class="home-video-text{% if settings.video_type == 'sound' %}-bottom{% endif %}">
                {% if settings.video_subtitle %}
                    <div class="mb-3">{{ settings.video_subtitle }}</div>
                {% endif %}
                {% if settings.video_title %}
                    <h2 class="h1-huge mb-3">{{ settings.video_title }}</h2>
                {% endif %}
                {% set has_video_button = settings.video_button and settings.video_button_url  %}
                {% if settings.video_text %}
                    <p class="mb-3">{{ settings.video_text }}</p>
                {% endif %}
                {% if has_video_button %}
                    <a href="{{ settings.video_button_url }}" class="btn btn-primary btn-small d-inline-block">{{ settings.video_button }}</a>
                {% endif %}
            </div>
        {% endif %}
    </section>
{% endif %}
