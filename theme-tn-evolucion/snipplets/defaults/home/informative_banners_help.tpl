{# Informative banners that work as examples #}

<section class="section-informative-banners" data-store="banner-services">
    <div class="container">
        <div class="row">
            <div class="col-12 p-0 px-md-3">
                <div class="js-informative-banners-demo swiper-container w-100 p-1">
                    <div class="swiper-wrapper">
                        {% include 'snipplets/defaults/help_banner_services_item.tpl' with {'help_item_1': true} %}
                        {% include 'snipplets/defaults/help_banner_services_item.tpl' with {'help_item_2': true} %}
                        {% include 'snipplets/defaults/help_banner_services_item.tpl' with {'help_item_3': true} %}
                        {% include 'snipplets/defaults/help_banner_services_item.tpl' with {'help_item_4': true} %}
                    </div>
                </div>
                <div class="js-informative-banners-pagination-demo swiper-pagination swiper-pagination-bullets position-relative d-block d-md-none"></div>
            </div>
        </div>
    </div>
</section>