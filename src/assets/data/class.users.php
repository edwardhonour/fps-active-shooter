<?php

require_once('../../../lib/class.OracleDB.php');

class USERS {

    public $X;

    function __construct() {
         $this->X=new OracleDB();
    }

    function getUser($data) {
	    $output=array();
        $output['uid']=$data['uid'];
        $sql="SELECT * FROM TBL_USER WHERE USER_ID = " . $data['uid'];
        $output=array();
        $list=$this->X->sql($sql);
        if (sizeof($list)==0) {
            $output['forced_off']=1;
        } else {
            $output=$list[0];
            $output['forced_off']=0;
        }
        return $output;		
	}
	
} //-- End