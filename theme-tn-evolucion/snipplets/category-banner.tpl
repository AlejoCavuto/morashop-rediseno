{% set image_sizes = ['small', 'large', 'huge', 'original', '1080p'] %}
{% set category_images = [] %}
{% set has_category_images = category.images is not empty %}

{% for size in image_sizes %}
    {% if has_category_images %}
        {# Define images for admin categories #}
        {% set category_images = category_images|merge({(size):(category.images | first | category_image_url(size))}) %}
    {% else %}
        {# Define images for general banner #}
        {% set category_images = category_images|merge({(size):('banner-products.jpg' | static_url | settings_image_url(size))}) %}
    {% endif %}
{% endfor %}

{% set category_image_url = 'banner-products.jpg' | static_url %}

<section class="category-banner position-relative" data-store="category-banner">
    <img class="category-banner-image lazyautosizes lazyload fade-in w-100" src="{{ category_images['small'] }}" data-srcset="{{ category_images['large'] }} 480w, {{ category_images['huge'] }} 640w, {{ category_images['original'] }} 1024w, {{ category_images['1080p'] }} 1920w" data-sizes="auto" alt="{{ 'Banner de la categoría' | translate }} {{ category.name }}" />
    <div class="textbanner-text category-banner-info over-image over-image-invert">
        <div class="h-100 d-flex justify-content-center align-items-center">
            <div class="container px-0 p-md-3">
                {% embed "snipplets/page-header.tpl" with {breadcrumbs: false, container: false, padding: false, page_header_class: 'text-uppercase'} %}
                        {% block page_header_text %}{{ category.name }}{% endblock page_header_text %}
                    {% endembed %}
                {% if category.description %}
                    <p class="mt-2 mb-0">{{ category.description }}</p>
                {% endif %}
            </div>
        </div>
    </div>
</section>