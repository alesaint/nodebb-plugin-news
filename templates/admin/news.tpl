<div class="news">
    <div class="col-md-12">
        <h1>News</h1>

    <div class="col-md-12">
        <form class="form" id="newsSettingsForm" method="post" action="/admin/news/add">
            <h3>Settings News</h3>

            <hr>

            <div class="form-group">
                <label for="categoryId">Category for news</label>
                <select id="categoryNewsId" class="form-control">
                <!-- BEGIN categories -->
                    <option value="{categories.cid}">{categories.name}</option>
                <!-- END categories -->
            </select>

            </div>


             <button id="saveSettings" class="btn btn-success btn-xs pull-right">
                       Save
             </button>


        </form>
    </div>

    <div class="col-xs-6 pull-left">
        <form class="form" id="newsForm" method="post" action="/admin/news/add">
            <h3>Add news</h3>

            <hr>

            <div class="form-group">
                <label for="title">Title</label>
                <input id="title" name="title" placeholder=""class="form-control">
            </div>

            <hr>

            <div class="form-group">
               <label for="description">Content</label>
               <textarea class="form-control" id="description" name="description" rows="15"></textarea>
            </div>

            <hr>

            <input type="hidden" name="_csrf" value="{token}" id="csrf-token" />
            <input type="hidden" name="catId" value="{catId}" id="catId" />


             <button id="save" class="btn btn-success btn-xs pull-right">
                       Save
             </button>


        </form>
    </div>
    <div class="col-xs-6 pull-right">
        <h3>Manage</small>
        </h3>

        <hr>
        <div class="row admin-categories">
            <ul class="col-md-12 ui-sortable" id="entry-container">
            <!-- BEGIN news -->
                <li data-cid="{news._key}" class="entry-row">
                    <input type="hidden" data-tid="{news.tid}"/>
                    <div class="well">
                        <form class="form">
                            <div class="row">
                               <div class="col-sm-8 col-xs-12">
                                    <div class="form-group">
                                        <label id="id-{news._key}-title">{news.title}</label>
                                    </div>
                               </div>
                               <div class="col-sm-4 col-xs-12">
                                  <div class="form-group">
                                        <div class="dropdown">
                                            <button class="btn btn-default edit">Edit</button>

                                            <button class="btn btn-primary remove">Remove</button>
                                        </div>
                                    </div>
                               </div>
                        </form>
                    </div>
                </li>
            <!-- END news -->
            </ul>
        </div>
     </div>
    <div class="col-xs-12">
        <hr>
    </div>
</div>

<script src="/plugins/nodebb-plugin-news/public/js/admin.js"></script>