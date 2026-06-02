{# Main categories item demo #}

<div class="swiper-slide w-md-auto">
    <div class="home-category text-center">
        <div class="home-circle-image home-circle-image-md">
            {% if help_item_1 %}
                {% include "snipplets/svg/help/help-main-category-1.tpl" %}
            {% elseif help_item_2 %}
                {% include "snipplets/svg/help/help-main-category-2.tpl" %}
            {% elseif help_item_3 %}
                {% include "snipplets/svg/help/help-main-category-3.tpl" %}
            {% endif %}
        </div>
    </div>
</div>