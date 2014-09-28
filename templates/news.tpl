<div class="row news">
    <div class="col-md-12" id="news-container">
       <!-- BEGIN news -->
       <article data-sid="{news.sid}" data-index="{news.index}" class="inlineContainer col-md-12 col-xs-12">
           <div class="details col-md-3 col-xs-12" style="background-image:url({news.pathImg})" >
           </div>
           <div class="post borderBox col-md-9 col-xs-12"">
                <h3><a href="/topic/{news.tid}">{news.title}</a></h3>
                <p>{news.content}</p>
                <div class="bottom"><a class="generalButton" href="/topic/{news.tid}">Accéder au post</a></div>
            </div>
        </article>
        <!-- END news -->
    </div>
</div>
<script src="/plugins/nodebb-plugin-news/public/js/news-page.js"></script>