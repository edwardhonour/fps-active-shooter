<?php

require_once('../../../lib/class.OracleDB.php');

class SHOOTER_PLAN {

    public $X;

    function __construct() {
         $this->X=new OracleDB();
    }


    function getTemplatePage($data) {
		
	   $output=array();
       $output['uid']=$data['uid'];
	   $sql="SELECT * FROM TBL_USER WHERE USER_ID = " . $data['id'];
       $user=$this->X->sql($sql);
       if (sizeof($user)==0) {
            $u=array();
            $u['forced_off']=1;
       } else {
            $u=$user[0];
            $u['forced_off']=0;
       }
       $output['user']=$u;

       $sql="select * from DOCWORKINGDATA where BUILDING_NBR = '" . $data['id'] . "' ";
       $sql.=" AND PAGE_ID = " . $data['id2'] . " ORDER BY PARAGRAPH_ID";
       $o=$this->X->sql($sql);
       $output['paragraphs']=$o;

	   $sql="SELECT * from TBL_DIM_FACILITY WHERE BUILDING_NBR = '" . $data['id'] . "' ";
	   $facility=$this->X->sql($sql);
	   $output['facility']=$facility;

       return $output;
    }
	
	function postEditAsset($data) {

           $uid=$data['uid'];
 
           $post=array();
           $post['table_name']="FPS_BSA";
           $post['sequence_name']="MEANINGLESS_KEY_SEQ";
           $post['primary_key']="ASSET_ID";
           $post['action']="insert";
           $post['ASSET_ID']=$data['data']['ASSET_ID'];
           foreach($data['data'] as $name => $value) {
               if($name!="components"&&$name!="docs"&&$name!="history"&&$name!="doc_count"&&$name!="history_count") $post[$name]=$value;
           }

           $this->X->post($post);

	   $sql="select BUILDING_NBR, FACILITY_ID FROM FPS_BSA WHERE ASSET_ID = " . $data['data']['ASSET_ID'];
           $b=$this->X->sql($sql);
           $building_nbr=$b[0]['BUILDING_NBR'];
           $facility_id=$b[0]['FACILITY_ID'];
           
           $data=array();
           $data['id']=$facility_id;
           $data['uid']=$uid;    
           $data['data']=array();    
           $data['data']['id']=$facility_id;
           $data['data']['uid']=$uid;    

	} 	

} //-- End of Class