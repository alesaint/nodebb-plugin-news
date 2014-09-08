<div class="news">
    <div class="col-md-12">
        <h1>News</h1>


    <div class="col-xs-6 pull-left">
        <form class="form" id="newsForm" method="post" action="/admin/news/add">
            <h3>Settings
                <small>Add news</small>
            </h3>

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


            <div class="form-group">
                            <label for="userPhoto">[[user:upload_a_picture]]</label>
                            <input type="file" id="userPhotoInput"  name="userPhoto">
                            <p class="help-block">[[user:image_spec]] <span id="file-size-block" class="hide"> ([[user:max]] <span id="upload-file-size"></span> kbs.)</span></p>
                        </div>

            <input type="hidden" name="_csrf" value="{token}" id="csrf-token" />

             <button id="save" class="btn btn-success btn-xs pull-right">
                       Save
             </button>


        </form>
    </div>
    <div class="col-xs-6 pull-right">
        <h3>Settings
            <small>Manage news</small>
        </h3>

        <hr>
        <div class="row admin-categories">
            <ul class="col-md-12 ui-sortable" id="entry-container">
            <!-- BEGIN news -->
                <li data-cid="{news._key}" class="entry-row">
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