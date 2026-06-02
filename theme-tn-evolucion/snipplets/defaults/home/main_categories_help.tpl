{# Main categories that work as examples #}

<section class="section-categories-home position-relative" data-store="home-categories-featured">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-2">
                <h2 class="h6 mb-3 mb-md-0">{{ 'Categorías' | translate }}</h2>
            </div>
            <div class="col-12 col-md-10">
                <div class="js-swiper-categories-demo swiper-container w-auto mx-4 m-md-0">
                    <div class="swiper-wrapper">
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_1': true}  %}
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_2': true}  %}
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_3': true}  %}
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_1': true}  %}
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_2': true}  %}
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_3': true}  %}
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_1': true}  %}
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_2': true}  %}
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_3': true}  %}
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_1': true}  %}
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_2': true}  %}
                        {% include 'snipplets/defaults/home/main_category_item_help.tpl' with {'help_item_3': true}  %}  
                    </div>
                </div>
                <div class="js-swiper-categories-prev-demo swiper-button-prev swiper-button-outside svg-icon-text">{% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
                <div class="js-swiper-categories-next-demo swiper-button-next swiper-button-outside svg-icon-text">{% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
            </div>
        </div>
    </div>
</section>
