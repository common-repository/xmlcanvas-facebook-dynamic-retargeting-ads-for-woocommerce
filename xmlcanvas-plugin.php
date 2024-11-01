<?php
/*
Plugin Name: XMLCanvas - Facebook Dynamic Retargeting Ads for WooCommerce
Plugin URI:  https://documentation.xmlcanvas.com/start/guides/my-api-key/
Description: The XMLCanvas - Facebook Dynamic Retargeting Ads for WooCommerce plugin lets you easily add enriched images to product images at XML feed and sell more with help of facebook Dynamic ads.
Author:      ProgSol, Programmatic Solution, s.r.o.
Author URI:  http://progsol.cz/en/
Version:     0.1
Requires at least: 3.8
Tested up to: 4.7
Text Domain: xmlcanvas-facebook-dynamic-retargeting-ads-for-woocommerce
License: GPLv2 or later
*/

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Copyright 2017 ProgSol, Programmatic Solution, s.r.o.
*/

wp_register_style( 'xmlcanvas_style_V01', plugins_url( '/css/style.css', __FILE__ ));
wp_register_script('js_XmlCanvas_V01', plugins_url( '/js/js-xml-canvas.js', __FILE__ ), array('jquery'), 'V01', false);

wp_enqueue_style('xmlcanvas_style_V01');
wp_enqueue_script('js_XmlCanvas_V01', plugins_url( '/js/js-xml-canvas.js', __FILE__ ), array('jquery'), 'V01', false);

add_action('admin_menu', 'register_xmlcanvas_V01');
register_activation_hook(__FILE__, 'xml_canvas_V01_activate');

function register_xmlcanvas_V01(){
    add_menu_page('XMLCanvas Page', 'XMLCanvas', 'administrator', 'xml_canvas_V01', 'fcXMLCanvas_V01', plugins_url( '/img/favicon.png', __FILE__ ));
}

//Update/Create API key
function apiKey_xmlCanvas_V01_Update($api_key_xmlCanvas_V01){
    GLOBAL $wpdb;
    //create in DB if already isn't existing TABLE xmlCanvas_V01
    $sqlCreateTableIfNotExist = "CREATE TABLE IF NOT EXISTS `xmlCanvas_V01` (
    `api_key` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `id` int(10) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sqlCreateTableIfNotExist );

    // remove name {API key}.
    $wpdb->delete( 'xmlCanvas_V01', array( 'name' => 'API key' ) );

    //insert name {API key}.
    $wpdb->insert( 
            'xmlCanvas_V01', 
            array( 
                    'api_key' => $api_key_xmlCanvas_V01,
                    'name' => 'API key',
                    'id' => 1
            ), 
            array( 
                    '%s',
                    '%s',
                    '%d'
            ) 
    );
//    my_print_error_xmlCanvas_V01;
//    return $wpdb->insert_id; 
}
    
//Get actual API key
function apiKey_xmlCanvas_V01_Get() {
        GLOBAL $wpdb;
        $myApiKey = $wpdb->get_row( "SELECT `api_key` FROM `xmlCanvas_V01` WHERE `name` = 'API key'" );
        return $myApiKey->api_key;
}    

//Hook for uninstall
function xml_canvas_V01_activate(){
    register_uninstall_hook( __FILE__, 'xml_canvas_V01_uninstall' );
}

//And here goes the uninstallation function:
function xml_canvas_V01_uninstall(){
    global $wpdb;
    $wpdb->query( "DROP TABLE IF EXISTS xmlCanvas_V01" );  
}

//Main function of plugin
function fcXMLCanvas_V01(){
        
    $apiKey = apiKey_xmlCanvas_V01_Get(); //get my actual API key from DB
    $apiKey = sanitize_key(esc_attr($apiKey)); //SANITIZE data from DB (table xmlCanvas_V01)
    if ( strlen( $apiKey ) > 120 ) { $apiKey = substr( $apiKey, 0, 120 );} //VALIDATE - varchar 120


    if(isset($_POST['api_key'])){ 
        $apiKey = sanitize_key(esc_attr(trim($_POST['api_key']))); //SANITIZE data from user input
        if ( strlen( $apiKey ) <= 120 ) { //VALIDATE - varchar 120
            apiKey_xmlCanvas_V01_Update($apiKey);
        }             

    }         
?>        
    <h1 class="pluginTopNadpis">XMLCanvas - Facebook Dynamic Retargeting Ads for WooCommerce</h1><br>

    <div id="poststuff" class="metabox-holder has-right-sidebar">

        <div id="post-body">
            <div id="post-body-content" style="margin-right: 15px;">
                <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                    <div style="float: left; min-width: 850px;">
                        <form name="epm-sign-up-form" action="#" method="post">
                            <table class="form-table">
                                <tbody>
                                    <tr><th scope="row">Your XmlCanvas API Key</th>
                                        <td><input id="userApiKeyInput"
                                                   style="min-width: 390px; width: 100%; font-size: 11px;"
                                                   type="text" class="regular-text"
                                                   name="api_key" 
                                                   value="<?= $apiKey ?>">
                                            <label for="api_key"><br> Enter your XmlCanvas API key here. 
                                                <br>
                                                <a href="https://documentation.xmlcanvas.com/start/guides/my-api-key/" 
                                                   target="_blank">Where can I find my api key?</a>
                                            </label>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <input type="submit"
                                   name="epm-submit-xmlCanvas" 
                                   value="<?php if(($apiKey != '')&&($apiKey != NULL)){echo 'Update API key';}else{echo 'Sign Up Now';}?>" 
                                   data-wait-text="<?php _e('Please wait...','easy-peasy-mailchimp');?>" 
                                   tabindex="2" class="button btn epm-sign-up-button epm-submit-chimp"/>            

                        </form>
                    </div>
                    <br clear="all">
                    <hr>                        
                </div>

            <?php 
            //https://api.xmlcanvas.com/2.0/{api_key}
            if(($apiKey != '')&&($apiKey != NULL)){

                $json = file_get_contents('https://api.xmlcanvas.com/2.0/'.$apiKey);
                $obj = json_decode($json);
//                    echo $json;
                if($obj->title == 'User Detail'){
                        $jsonMyFeeds = file_get_contents('https://api.xmlcanvas.com/2.0/'.$apiKey.'/my_feeds/');
                        $objMyFeeds = json_decode($jsonMyFeeds);
                        if($objMyFeeds->preview){
                            $startDefaultPrimarmenu = 'myFeedsXmlCanvas';
                        }else{
                            $startDefaultPrimarmenu = 'templatesXmlCanvas';
                        }
                    ?>
                    <ul class="ul_xmlc_top">
                        <li data-menu="defaultXmlCanvas" class="chbtn_top button btn">​Systém information</li>
                        <li data-menu="templatesXmlCanvas" class="chbtn_top button btn <?php if($startDefaultPrimarmenu=='templatesXmlCanvas'){echo 'chbtn_active';}?>">​New feed</li>
                        <li data-menu="myFeedsXmlCanvas" class="chbtn_top button btn <?php if($startDefaultPrimarmenu=='myFeedsXmlCanvas'){echo 'chbtn_active';}?>" id="trgNewOrder">My feeds</li>                            
                    </ul>

                    <div id="defaultXmlCanvas" class="userInfo_xmlc_top">
                        <h3>Your API key:</h3>
                        <span style="font-size: 10px; padding: 5px; background-color: white; margin: 8px 0px; line-height: 30px;"><?= $apiKey ?></span>
                        <h3>Is paired with:</h3>                            
                        <div class="stepBox stepBoxDefault">
                        <?php
                        echo 'Account: <span class="boldInfo">active</span>' . '<br>';
                        echo 'Credit balance: <span id="creditBalance" class="boldInfo">$ ' . $obj->credit . '</span><a target="_blank" class="button btn" href="https://xmlcanvas.com/gopay/credit.php" >​Add credit</a><br>';                            
                        echo 'User login: <span class="boldInfo">' . $obj->email . '</span><br>';
                        ?>
                        </div>
                    </div>

                    <div id="templatesXmlCanvas" class="userInfo_xmlc_top <?php if($startDefaultPrimarmenu=='templatesXmlCanvas'){echo 'userInfo_active';}?>">
                        <h3>Create New Feed:</h3>

                        <div class="stepBox">
                            <h4>1. Enter your XML feed:</h4> 
                            <input id="stepOneNewFeed" type="text" class="regular-text" name="newFeed" value="">
                            <span class="chbtn_StepOneNewFeed button btn">Validate XML feed</span>
                            <div class="ajaxInfoNewOrder"></div>
                        </div>

                        <div class="stepBox">
                            <h4>2. Chosse one of templates here bellow:</h4>

                            <div id="systemTemplatesXmlCanvas" class="userInfo_xmlc_systemUser userInfo_active">                           
                                <?php
                                $jsonSystemTemplates = file_get_contents('https://api.xmlcanvas.com/2.0/'.$apiKey.'/system_templates/');
                                $objSystemTemplate = json_decode($jsonSystemTemplates);
                                $rectangelSystem = '';
                                $squareSystem  = '';
                                foreach ($objSystemTemplate->preview as $dataSystemTemplate) {
                                    if($dataSystemTemplate->format=='rectangel'){
                                        $rectangelSystem  .= '<img class="imgSystemUser" title="'.$dataSystemTemplate->templates_id.'" src="'.$dataSystemTemplate->img.'">';
                                    }else{
                                        $squareSystem  .= '<img class="imgSystemUser imgSystemUserSquare" title="'.$dataSystemTemplate->templates_id.'" src="'.$dataSystemTemplate->img.'">';
                                    }
                                }
                                ?>
                                <ul>
                                    <li data-menu="rectangelSystem" class="chbtn button btn chbtn_active">Rectangel</li>
                                    <li data-menu="squareSystem" class="chbtn button btn">Square</li>
                                </ul>
                                <div id="rectangelSystem" class="userInfo_xmlc userInfo_active">System Templates / Rectangel:<br><hr><?= $rectangelSystem ?></div>
                                <div id="squareSystem" class="userInfo_xmlc">System Templates / Square:<br><hr><?= $squareSystem ?></div>
                            </div> 
                        </div>

                        <div class="stepBox">
                            <h4>3. Save new order:</h4> 
                            <div class="ajaxInfoNewOrderStep3"></div>
                            <span class="button btn createNewFeed">Create new feed</span>
                        </div>
                    </div>

                    <div id="myFeedsXmlCanvas" class="userInfo_xmlc_top stepBoxDefault <?php if($startDefaultPrimarmenu=='myFeedsXmlCanvas'){echo 'userInfo_active';}?>">
                    <?php
                        if($objMyFeeds->preview){                               
                            foreach ($objMyFeeds->preview as $dataMyFeeds) {
                                echo '<br clear="all"> <div id="box'.$dataMyFeeds->feed_id.'" class="editMyFeedClosest" style="">';
                                echo '<div class="ajaxInfoCoverEditMyFeed '.$dataMyFeeds->feed_id.'"></div>';                                    
                                if($dataMyFeeds->userStop==1){
                                    echo '<span class="trailer" style="color:red">PAUSE</span>';
                                }else{
                                    if($dataMyFeeds->lastGenerated=='Awaiting processing'){
                                        echo '<div class="trailerMiniBox trailerMiniBoxOrange"><span class="trailerMini trailerMiniOrange">NEW</span></div>';
                                    }else{
                                        echo '<div class="trailerMiniBox"><span class="trailerMini">Ready</span></div>';   
                                    }
                                    if($dataMyFeeds->paymentMode=='FreeRezim'){
                                        echo '<span class="trailer">14 days FREE</span>';
                                    }
                                    if($dataMyFeeds->paymentMode=='KodZdarmaRezim'){
                                        echo '<span class="trailer">Promotions</span>';
                                    }
                                    if($dataMyFeeds->paymentMode=='Free_10_Item'){
                                        echo '<span class="trailer">FREE</span>';
                                    }
                                }
                                echo '<table class="tableStartStopFeed">';
                                echo '<tr><td>';
                                if($dataMyFeeds->userStop==1){
                                    echo '<span onclick="startStopFeed(this)" data-action="start" data-feedId="'.$dataMyFeeds->feed_id.'" class="button btn startStopFeed">Start</span>';
                                }else{
                                    echo '<span onclick="startStopFeed(this)" data-action="stop" data-feedId="'.$dataMyFeeds->feed_id.'" class="button btn startStopFeed">Stop</span>';
                                }
                                echo '</td><td class="wtbtdStartStopFeed"><img class="imgStartStopFeed" title="'.$dataMyFeeds->feed_id.'" src="'.$dataMyFeeds->img.'"></td></tr>';
                                echo '<tr><td>Input feed: </td><td>' . $dataMyFeeds->feed_in . '</td></tr>';
                                echo '<tr><td>Output feed: </td><td>' . $dataMyFeeds->feed_out . '</td></tr>';
                                echo '<tr><td>Date of last generated: </td><td class="lastGenerated">' . $dataMyFeeds->lastGenerated . '</td></tr>';
                                if(($dataMyFeeds->userStop==0)&&($dataMyFeeds->paymentMode=='Free_10_Item')){
                                    echo '<tr><td>Active until: </td><td class="paidUntill"><span id="prolong'.$dataMyFeeds->feed_id.'">' . array_shift(explode(" ",$dataMyFeeds->paidUpToDay)). '</span>  <span id="button'.$dataMyFeeds->feed_id.'" onclick="prolongFreeFeed(this)" data-action="prolong" data-feedId="'.$dataMyFeeds->feed_id.'" class="button btn" title="Maximum of days to prolong is 30 days from today!">Prolong</span></td></tr>';
                                }else{
                                    echo '<tr><td>Active until: </td><td class="paidUntill"><span id="prolong'.$dataMyFeeds->feed_id.'">' . $dataMyFeeds->paidUpToDay . '</span></td></tr>';
                                }

                                echo '</table>';
                                echo '</div>';
                            }
                        }else{
                            echo '<div class="hideInfoZeroOrder"><br clear="all"><div class="stepBox stepBoxDefault">';
                            echo '<h3>XmlCanvas did not find any of your orders?</h3>';
                            echo '</div></div>';
                        }     
                    ?>
                    </div>
                    <?php
                }else{
                    //error
                    echo '<div id="userData">';
                    echo $obj->title . '<br>';
                    echo $obj->detail . '<br>';
                    echo $obj->type . '<br>';                    
                    echo '</div>';
                }
            } 
            ?>
            </div>
        </div>
        <br class="clear">
    </div>
<?php
}