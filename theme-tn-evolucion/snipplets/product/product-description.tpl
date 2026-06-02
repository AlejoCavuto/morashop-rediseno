{% set description_content = product.description is not empty or settings.show_product_fb_comment_box %}
<div class="{% if not description_content %}mt-2 mt-md-0{% endif %} {% if settings.full_width_description %}container pt-md-3{% else %}px-md-3{% endif %} pb-md-4" data-store="product-description-{{ product.id }}">

  {% if settings.full_width_description %}
    <div class="row">
      {% if description_content %}
        <div class="col-md-10 pr-md-5">
      {% endif %}
  {% endif %}

        {% if product.description is not empty %}
          <h5 class="font-big mb-4">{{ "Descripción" | translate }}</h5>
          <div class="user-content font-small mb-4 description-wrapper">
            <div class="description-text collapsed">
              {{ product.description }}
            </div>
            <button type="button" class="description-toggle">Ver más</button>
          </div>
        {% endif %}

        {% if settings.show_product_fb_comment_box %}
          <div class="fb-comments section-fb-comments mb-3" data-href="{{ product.social_url }}" data-num-posts="5" data-width="100%"></div>
        {% endif %}
        <div id="reviewsapp"></div>

        {% if not settings.full_width_description %}
          {% include 'snipplets/social/social-share.tpl' %}
        {% endif %}

  {% if settings.full_width_description %}
      {% if description_content %}
        </div>
      {% endif %}
      <div class="col-md-2">
        {% include 'snipplets/social/social-share.tpl' %}
      </div>
    </div>
  {% endif %}
</div>

<style>
/* ===== Limitar descripción ===== */
.description-text {
  max-height: 80px;           /* altura aproximada ~100 caracteres */
  overflow: hidden;
  position: relative;
  transition: max-height .3s ease;
}
.description-text.expanded {
  max-height: none;           /* sin límite */
}
.description-toggle {
  background: #001c4b;     /* azul oscuro */
  color: #fff;             /* texto blanco */
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 14px;
  margin-top: 8px;
  display: inline-block;
  transition: background 0.2s ease;
}
.description-toggle:hover {
  background: #001c4b;     /* azul más claro en hover */
}

</style>

<script>
document.addEventListener("DOMContentLoaded", function(){
  const wrapper = document.querySelector(".description-wrapper");
  if(!wrapper) return;
  const text = wrapper.querySelector(".description-text");
  const btn = wrapper.querySelector(".description-toggle");

  btn.addEventListener("click", () => {
    const expanded = text.classList.toggle("expanded");
    btn.textContent = expanded ? "Ocultar" : "Ver más";
  });
});
</script>
