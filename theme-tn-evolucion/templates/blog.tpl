{% embed "snipplets/page-header.tpl"  with { breadcrumbs: true } %}
    {% block page_header_text %}{{ "Blog" | translate }}{% endblock page_header_text %}
{% endembed %}
<div class="container mb-5">
    <section class="blog-page">
        <div class="row">
            {% for post in blog.posts %}
                <div class="col-md-4">
                    {{ component(
                        'blog/blog-post-item', {
                            image_lazy: true,
                            image_lazy_js: true,
                            post_item_classes: {
                                item: 'item p-0 mb-4 pb-2 ',
                                image_container: '',
                                image: 'img-absolute img-absolute-centered fade-in',
                                information: 'item-description',
                                title: 'item-name mt-1 mb-3',
                                summary: 'mb-3 font-small',
                                read_more: 'btn-link btn-link-primary',
                            },
                        })
                    }}
                </div>
            {% endfor %}
        </div>
        {% include 'snipplets/grid/pagination.tpl' with {'pages': blog.pages} %}
    </section>
</div>
