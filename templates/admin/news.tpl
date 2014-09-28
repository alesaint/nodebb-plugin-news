<div class="news">
    <div class="col-md-12">
        <h1>News</h1>

    <div class="col-md-12">
        <form class="form" id="newsSettingsForm" method="post">
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


        </form>
    </div>

    <div class="col-xs-6 pull-left">
        <form class="form" id="newsForm" method="post">
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

            <div class="form-group hidden col-xs-12">
                <div id="editImgNews"></div>
                <button id="editImgBtn" class="btn btn-default btn-xs pull-left">
                           Image
                 </button>

            </div>

            <input type="hidden" name="_csrf" value="{token}" id="csrf-token" />
            <input type="hidden" name="catId" value="{catId}" id="catId" />
            <input type="hidden" name="hiddenNewsId" value="" id="hiddenNewsId" />
            <input type="hidden" name="hiddenNewsImg" value="" id="hiddenNewsImg" />
            <input type="hidden" name="hiddenTopicId" value="" id="hiddenTopicId" />


<hr>

              <button id="edit" class="btn btn-success btn-xs pull-left hidden">
                        Save
              </button>
                 <button id="save" class="btn btn-success btn-xs pull-left">
                           Save
                 </button>



        </form>
    </div>
    <div class="col-xs-6 pull-right">
        <h3>Manage</small>
        </h3>

        <hr>
        <div class="row admin-news">
            <ul class="col-md-12 ui-sortable" id="entry-container">
            <!-- BEGIN news -->
                <li data-cid="{news._key}" class="entry-row">
                    <input type="hidden" data-tid="{news.tid}"/>
                    <div class="well">
                        <form class="form">
                            <div class="row">
                               <div class="col-sm-6 col-xs-12">
                                    <div class="form-group">
                                        <label id="id-{news._key}-title">{news.title}</label>
                                    </div>
                               </div>
                               <div class="col-sm-6 col-xs-12">
                                  <div class="form-group">
                                        <div class="dropdown">

                                            <button class="btn btn-default edit">Edit</button>
                                            <!-- IF news.highlight -->
                                            <button class="btn btn-danger highlight" id="disableHighlight">header</button>
                                             <!-- ELSE -->
                                             <button class="btn btn-success highlight" id="enableHighlight">header</button>
                                             <!-- ENDIF news.highlight -->
                                            <button class="btn btn-danger remove">Remove</button>
                                        </div>
                                    </div>
                               </div>
                               <input type="hidden" data-name="order" data-value="{news.order}" value="{news.order}">
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