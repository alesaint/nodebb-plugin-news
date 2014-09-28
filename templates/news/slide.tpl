<!-- IF news.length -->
<div id="slidebox">
    <div class="inner">
        <div class="left"><div></div></div>
        <div class="right"><div></div></div>
        <div class="images">
            <!-- BEGIN news -->
            <div class="slideImage">
                <div class="imageNews" style="background-image:url({news.pathImg});" alt="{news.title}"></div>
                <a class="readMore generalButton" href="/topic/{news.tid}">{news.title}</a>
            </div>
            <!-- END news -->
        </div>
    </div>
</div>
<!-- ENDIF news.length -->
<script src="/plugins/nodebb-plugin-news/public/js/widget.js"></script>