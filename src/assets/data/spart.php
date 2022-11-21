<?php
//---------------------------------------------------------------------
// Main API Router for this angular directory.
// Author: Â Edward Honour
// Date: 07/18/2021
//---------------------------------------------------------------------

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Authorization');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,PUT,POST,DELETE,PATCH,OPTIONS');
header('Content-type: application/json');

require_once('class.OracleDB.php');

$uid=$_COOKIE['uid'];

$X=new OracleDB();
$db=$X->connectACN();

// Require and initialize the class libraries necessary for this module. Code
// specific for your application goes in here.

//=======================================================================================
// APPLICATION SPECIFIC CODE BELOW - CONNECT STRING CODE ABOVE
//=======================================================================================

class SHOOTER {

    public $X;
    public $json;
    public $arr;
    function __construct() {
         $this->X=new OracleDB();
    }
    function getUser($data) {
            if (!isset($data['uid'])) $data['uid']="55009";
            if ($data['uid']=="") $data['uid']="55009";
            $sql="select * from FPS_USER WHERE USER_ID = " . $data['uid'];
            $user=$this->X->sql($sql);
            $u=array();
            if (sizeof($user)==0) {
                    $u['forced_off']=1;
            } else {
                    $u=$user[0];
                    $u['forced_off']=0;
            }
            return $u;
    }

    function isJSON($string){
       return is_string($string) && is_array(json_decode($string, true)) ? true : false;
    }

    function makeDefault() {
        $arr=array();
        $arr['type']="doc";
        $c=array();
        $d=array();
        array_push($c,$d);
        $arr['content']=$d;
        return $arr;
    }

    function getHomePage($data) {
            $output=array();
            $user=$this->getUser($data);
            if ($user['forced_off']==1) {
                    $output=array();
                    $output['user']=$user;
                    return $output;
            } else {

                    $output=array();
                    $output['user']=$user;
                    if ($data['id']=="") {
                            $data['id']="0";
                    }

                    $sql="select * from DHS_TEMPLATE ORDER BY TEMPLATE_ID ";
                    $templates=$this->X->sql($sql);
                    $output['templates']=$templates;

                    $formData=array();

                    $formData=array();
                    $formData['ID']="";
                    $formData['TEMPLATE_ID']="";
                    $formData['TEMPLATE_NAME']="";
                    $output['formData']=$formData;
            }
            $formData=array();
            $formData['ID']="";
            $formData['TEMPLATE_ID']="";
            $formData['TEMPLATE_NAME']="";
            $output['formData']=$formData;
          return $output;
    }

    function getInstructions($data) {
            $output=array();
            $user=$this->getUser($data);
            $template_id=$data['id'];
            $section_id=$data['id2'];

            if ($user['forced_off']==1) {
                    $output=array();
                    $output['user']=$user;
                    return $output;
            } else {

                    $output=array();
                    $output['user']=$user;
                    if ($data['id']=="") {
                            $data['id']="0";
                    }

                    $sql="select * from DHS_TEMPLATE WHERE TEMPLATE_ID = '" . $template_id . "'";
                    $template=$this->X->sql($sql);
                    $output['template']=$template[0];

                    $output['data_tables']=array();

                    $sql="select ID, TAG, DATA_NAME from DHS_DATA_SOURCE ORDER BY TAG";
                    $template=$this->X->sql($sql);
                    $output['tags']=$template;

                    $output['display_tables']=array();

                    $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $template_id . "' AND SECTION_LEVEL <> 3 ";
                    $sql.=" ORDER BY SECTION_ORDER";
                    $sections=$this->X->sql($sql);
                    $output['sections']=$sections;
                    $output['questions']=array();
                    $pages=array();
                    if ($data['id']!="") {
                        $sql="select * from DHS_TEMPLATE_SECTION ";
                        $sql.="WHERE TEMPLATE_ID = '" . $template_id . "' AND SECTION_ID = " . $section_id;
                        $cs=$this->X->sql($sql);
                        if (sizeof($cs)>0) {
                            $sectionData=array();
                            $sectionData['ID']=$cs[0]['ID'];
                            $sectionData['SECTION_NAME']=$cs[0]['SECTION_NAME'];
                            $sectionData['SECTION_ORDER']=$cs[0]['SECTION_ORDER'];
                            $sectionData['SECTION_ID']=$cs[0]['SECTION_ID'];
                            $sectionData['SECTION_LEVEL']=$cs[0]['SECTION_LEVEL'];
                            $output['sData']=$sectionData;
                                $output['current_section']=$cs[0];
                                if ($this->isJSON($cs[0]['JSON'])) {
                                        $output['current_section']['JSON']=json_decode($cs[0]['JSON'],true);
                                } else {
                                        $output['current_section']['JSON']=$this->makeDefault();
                                }
                        } else {
                                $output['current_section']=array();
                                $output['current_section']['HELP']="";
                                $output['current_section']['JSON']=$this->makeDefault();
                                $output['current_section']['HTML']="";
                        }
                        $section_before=0;
                        $section_after=99999;
                        $order_before=0;
                        $order_after=99999;
                        foreach($sections as $s) {
                                if ($s['SECTION_ID']<$section_id) {
                                    $section_before=$s['SECTION_ID'];
                                }
                                if ($s['SECTION_ID']>$section_id&&$section_after==99999) {
                                    $section_after=$s['SECTION_ID'];
                                }
                                if ($s['SECTION_ORDER']<$output['current_section']['SECTION_ORDER']) {
                                    $order_before=$s['SECTION_ID'];
                                }
                                if ($s['SECTION_ORDER']>$output['current_section']['SECTION_ORDER']&&$order_after==99999) {
                                    $order_after=$s['SECTION_ORDER'];
                                }
                                $output['section_before']=$section_before;
                                $output['section_after']=$section_after;
                                $output['order_before']=$order_before;
                                $output['order_after']=$order_after;
                        }

                    } else {
                        $output['current_section']=array();
                        $output['paragraphs']=array();
                    }


                    $formData=array();
                    $formData['ID']=$output['current_section']['ID'];
                    $formData['TEMPLATE_ID']=$data['id'];
                    $formData['SECTION_ID']=$output['current_section']['SECTION_ID'];
                    $formData['HELP']=$output['current_section']['HELP'];
                    $formData['JSON']=$output['current_section']['JSON'];
                    $formData['HTML']=$output['current_section']['HTML'];
                    $output['formData']=$formData;
            }
            $tableData=array();
            $output['tableData']=$tableData;

            $sql="SELECT * FROM DHS_TEMPLATE_QUESTION WHERE TEMPLATE_ID = '" . $template_id . "' AND ";
            $sql.=" SECTION_ID = " . $section_id . " ORDER BY ID";
            $qs=$this->X->sql($sql);
            $output['questions']=array();
            foreach($qs as $qr) {

                    if ($qr['QUESTION_TYPE']=='DATA'||$qr['QUESTION_TYPE']=='DISPLAY') {
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND ROW_ID = 0 AND COL_ID = 1";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_COL_1']="";
                    } else {
                        $qr['HEADER_COL_1']=$y[0]['DEFAULT_VALUE'];
                    }

                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND ROW_ID = 0 AND COL_ID = 2";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_COL_2']="";
                    } else {
                        $qr['HEADER_COL_2']=$y[0]['DEFAULT_VALUE'];
                    }

                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND ROW_ID = 0 AND COL_ID = 3";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_COL_3']="";
                    } else {
                        $qr['HEADER_COL_3']=$y[0]['DEFAULT_VALUE'];
                    }

                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND ROW_ID = 0 AND COL_ID = 4";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_COL_4']="";
                    } else {
                        $qr['HEADER_COL_4']=$y[0]['DEFAULT_VALUE'];
                    }

                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND ROW_ID = 0 AND COL_ID = 5";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_COL_5']="";
                    } else {
                        $qr['HEADER_COL_5']=$y[0]['DEFAULT_VALUE'];
                    }

                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND ROW_ID = 0 AND COL_ID = 6";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_COL_6']="";
                    } else {
                        $qr['HEADER_COL_6']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND ROW_ID = 0 AND COL_ID = 7";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_COL_7']="";
                    } else {
                        $qr['HEADER_COL_7']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND ROW_ID = 0 AND COL_ID = 8";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_COL_8']="";
                    } else {
                        $qr['HEADER_COL_8']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND ROW_ID = 0 AND COL_ID = 9";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_COL_9']="";
                    } else {
                        $qr['HEADER_COL_9']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND ROW_ID = 0 AND COL_ID = 10";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_COL_10']="";
                    } else {
                        $qr['HEADER_COL_10']=$y[0]['DEFAULT_VALUE'];
                   }

                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND COL_ID = 0 AND ROW_ID = 1";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_ROW_1']="";
                    } else {
                        $qr['HEADER_ROW_1']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND COL_ID = 0 AND ROW_ID = 2";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_ROW_2']="";
                    } else {
                        $qr['HEADER_ROW_2']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND COL_ID = 0 AND ROW_ID = 3";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_ROW_3']="";
                    } else {
                        $qr['HEADER_ROW_3']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND COL_ID = 0 AND ROW_ID = 4";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_ROW_4']="";
                    } else {
                        $qr['HEADER_ROW_4']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND COL_ID = 0 AND ROW_ID = 5";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_ROW_5']="";
                    } else {
                        $qr['HEADER_ROW_5']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND COL_ID = 0 AND ROW_ID = 6";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_ROW_6']="";
                    } else {
                        $qr['HEADER_ROW_6']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND COL_ID = 0 AND ROW_ID = 7";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_ROW_7']="";
                    } else {
                        $qr['HEADER_ROW_7']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND COL_ID = 0 AND ROW_ID = 8";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_ROW_8']="";
                    } else {
                        $qr['HEADER_ROW_8']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND COL_ID = 0 AND ROW_ID = 9";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_ROW_9']="";
                    } else {
                        $qr['HEADER_ROW_9']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="select * from DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND COL_ID = 0 AND ROW_ID = 10";
                    $y=$this->X->sql($sql);
                    if (sizeof($y)==0) {
                        $qr['HEADER_ROW_10']="";
                    } else {
                        $qr['HEADER_ROW_10']=$y[0]['DEFAULT_VALUE'];
                    }
                    $sql="SELECT * FROM DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $qr['ID'] . " AND COL_ID <> 0 AND ROW_ID <> 0";
                    $y=$this->X->sql($sql);
                    foreach($y as $z) {
                            if ($qr['QUESTION_TYPE']=='DATA') {
                                    $qr['COL_'.$z['COL_ID']]=$z['DEFAULT_VALUE'];
                            } else {
                                    $qr['ROW_'.$z['ROW_ID']]=$z['DEFAULT_VALUE'];
                            }
                    }
                    }
                    array_push($output['questions'],$qr);
            }

            $questionData=array();
            $questionData['ID']="";
            $questionData['SECTION_ID']=$section_id;
            $questionData['TEMPLATE_ID']=$template_id;
            $questionData['TAG_NAME']="";
            $questionData['OPTIONID']="";
            $questionData['TABLE_HEADER']="No";
            $questionData['TABLE_STYLE']="";
            $questionData['TABLE_WIDTH']="100";
            $questionData['DATA_DIRECTION']="Vertical";
            $questionData['QUESTION_TYPE']="";
            $questionData['CUSTOM_SQL']="";
            $questionData['DATA_SOURCE']="";
            $questionData['QUESTION']="";
            $questionData['DEFAULT_VALUE']="";
            $questionData['ROW_COUNT']="0";
            $questionData['COL_COUNT']="0";
            $questionData['HEADER_ROW_1']="";
            $questionData['HEADER_ROW_2']="";
            $questionData['HEADER_ROW_3']="";
            $questionData['HEADER_ROW_4']="";
            $questionData['HEADER_ROW_5']="";
            $questionData['HEADER_ROW_6']="";
            $questionData['HEADER_ROW_7']="";
            $questionData['HEADER_ROW_8']="";
            $questionData['HEADER_ROW_9']="";
            $questionData['HEADER_ROW_10']="";
            $questionData['HEADER_COL_1']="";
            $questionData['HEADER_COL_2']="";
            $questionData['HEADER_COL_3']="";
            $questionData['HEADER_COL_4']="";
            $questionData['HEADER_COL_5']="";
            $questionData['HEADER_COL_6']="";
            $questionData['HEADER_COL_7']="";
            $questionData['HEADER_COL_8']="";
            $questionData['HEADER_COL_9']="";
            $questionData['HEADER_COL_10']="";
            $questionData['COL_1']="";
            $questionData['COL_2']="";
            $questionData['COL_3']="";
            $questionData['COL_4']="";
            $questionData['COL_5']="";
            $questionData['COL_6']="";
            $questionData['COL_7']="";
            $questionData['COL_8']="";
            $questionData['COL_9']="";
            $questionData['COL_10']="";
            $questionData['ROW_1']="";
            $questionData['ROW_2']="";
            $questionData['ROW_3']="";
            $questionData['ROW_4']="";
            $questionData['ROW_5']="";
            $questionData['ROW_6']="";
            $questionData['ROW_7']="";
            $questionData['ROW_8']="";
            $questionData['ROW_9']="";
            $questionData['ROW_10']="";
            $output['questionData']=$questionData;

        $output['sectionData']=$sectionData;
            $sectionData=array();
            $sectionData['SECTION_ID']="";
            $sectionData['TEMPLATE_ID']=$template_id;
            $sectionData['SECTION_NAME']="";
            $sectionData['SECTION_ORDER']="";
            $sectionData['SECTION_LEVEL']="1";
            $sectionData['CURRENT_SECTION_ID']=$output['current_section']['SECTION_ID'];
            $sectionData['CURRENT_SECTION_ORDER']=$output['current_section']['SECTION_ORDER'];
            $sectionData['BEFORE']="BEFORE";

            $output['sectionData']=$sectionData;

          return $output;
    }

    function getAddContact($data) {
            $output=array();
            $user=$this->getUser($data);
            $template_id=$data['id'];
            $building_nbr=$data['id2'];
            $contact_id=$data['id3'];
            if ($contact_id=='') $contact_id = 0;


            if ($user['forced_off']==1) {
                    $output=array();
                    $output['user']=$user;
                    return $output;
            } else {

                    $output=array();
                    $output['user']=$user;
                    if ($data['id']=="") {
                            $data['id']="0";
                    }

                    $output['BUILDING_NBR']=$building_nbr;
                    $output['TEMPLATE_ID']=$template_id;

                    $sql="select * from DHS_TEMPLATE WHERE TEMPLATE_ID = '" . $template_id . "'";
                    $template=$this->X->sql($sql);
                    $output['template']=$template[0];

                    $sql="select * from RWH_DIM_FACILITY WHERE BUILDING_NBR = '" . $building_nbr . "'";
                    $template=$this->X->sql($sql);
                    $output['building']=$template[0];

                    $sql="select ID, CONTACT_NAME from FPS_FACILITY_CONTACTS WHERE BUILDING_NBR = '" . $building_nbr . "' AND  CONTACT_CLASS = 'ORGANIZATION' ORDER BY CONTACT_NAME";

                    $template=$this->X->sql($sql);
                   $output['org_list']=$template;
                    $output['orgs']=$template;

                    $sql="select * FROM FPS_FACILITY_CONTACTS WHERE ID = " . $contact_id;
                    $contact=$this->X->sql($sql);
                    if (sizeof($contact)>0) {
                         $formData=$contact[0];
                    } else {
                            $formData=array();
                            $formData['ID']="";
                            $formData['CREATE_TIMESTAMP']="";
                            $formData['CONTACT_ID']="";
                            $formData['BUILDING_NBR']=$building_nbr;
                            $formData['CONTACT_NAME']="";
                            $formData['CONTACT_TITLE']="";
                            $formData['CONTACT_AGENCY_CODE']="";
                            $formData['CONTACT_AGENCY_NAME']="";
                            $formData['CONTACT_PHONE']="";
                            $formData['CONTACT_EMAIL']="";
                            $formData['CONTACT_CALL_SIGN']="";
                            $formData['CONTACT_NOTE']="";
                            $formData['CONTACT_TYPE']="";
                            $formData['CONTACT_CLASS']="";
                            $formData['MISSION']="";
                            $formData['LE_EMS_FLAG']="";
                            $formData['TENANT_FLAG']="";
                            $formData['REP_CONTACT_ID']="";
                            $formData['CHAIR_CONTACT_ID']="";
                            $formData['EMERGENCY_CONTACT_FLAG']="";
                            $formData['PRIMARY_DELIVERY_TYPE']="";
                            $formData['SECONDARY_DELIVERY_TYPE']="";
                            $formData['OBJECT_CONTENTS']="";
                            $formData['STAND_UP_PROCESS']="";
                            $formData['OTHER_INFO']="";
                            $formData['LONGITUDE']="";
                            $formData['LATITUDE']="";
                    }
                    $output['formData']=$formData;

                    $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $template_id . "' AND SECTION_LEVEL <> 3 ";
                    $sql.=" ORDER BY SECTION_ORDER";
                    $sections=$this->X->sql($sql);
                    $output['sections']=$sections;
                    $pages=array();
                    if ($data['id']!="") {

                    } else {
                        $output['current_section']=array();
                        $output['paragraphs']=array();
                    }
            }
          return $output;
    }

    function getContacts($data) {
            $output=array();
            $user=$this->getUser($data);
            $template_id=$data['id'];
            $building_nbr=$data['id2'];
            $contact_id=$data['id3'];
            if ($contact_id=='') $contact_id = 0;


            if ($user['forced_off']==1) {
                    $output=array();
                    $output['user']=$user;
                    return $output;
            } else {

                    $output=array();
                    $output['user']=$user;
                    if ($data['id']=="") {
                            $data['id']="0";
                    }
                    $output['BUILDING_NBR']=$building_nbr;
                    $output['TEMPLATE_ID']=$template_id;
                    $sql="select * from DHS_TEMPLATE WHERE TEMPLATE_ID = '" . $template_id . "'";
                    $template=$this->X->sql($sql);
                    $output['template']=$template[0];

                    $sql="select * from RWH_DIM_FACILITY WHERE BUILDING_NBR = '" . $building_nbr . "'";
                    $template=$this->X->sql($sql);
                    $output['building']=$template[0];

                    $sql="select * from FPS_FACILITY_CONTACTS WHERE BUILDING_NBR = '" . $building_nbr . "' AND CONTACT_CLASS = 'ORGANIZATION' AND TENANT_FLAG = 'N' ORDER BY CONTACT_NAME";
                    $template=$this->X->sql($sql);
                    $output['orgs']=$template;

                    $sql="select ID, CONTACT_NAME from FPS_FACILITY_CONTACTS WHERE BUILDING_NBR = '" . $building_nbr . "' AND CONTACT_CLASS = 'ORGANIZATION' ORDER BY CONTACT_NAME";
                    $template=$this->X->sql($sql);
                    $output['org_list']=$template;

                    $sql="select * FROM FPS_FACILITY_CONTACTS WHERE BUILDING_NBR = '" . $building_nbr . "' AND CONTACT_CLASS = 'PERSON'";
                    $contact=$this->X->sql($sql);
                    $output['persons']=$contact;

                    $sql="select * FROM FPS_FACILITY_CONTACTS WHERE BUILDING_NBR = '" . $building_nbr . "' AND CONTACT_CLASS = 'ORGANIZATION'";
                    $contact=$this->X->sql($sql);
                    $output['organizations']=$contact;

    $sql="select * FROM FPS_FACILITY_CONTACTS WHERE TENANT_FLAG = 'Y' AND BUILDING_NBR = '" . $building_nbr . "' AND CONTACT_CLASS = 'ORGANIZATION'";
                    $contact=$this->X->sql($sql);
                    $output['tenants']=$contact;

                    $sql="select * FROM FPS_FACILITY_CONTACTS WHERE BUILDING_NBR = '" . $building_nbr . "' AND CONTACT_CLASS = 'LOCATION'";
                    $contact=$this->X->sql($sql);
                    $output['locations']=$contact;

                    $sql="select * FROM FPS_FACILITY_CONTACTS WHERE BUILDING_NBR = '" . $building_nbr . "' AND CONTACT_CLASS = 'OBJECT'";
                    $contact=$this->X->sql($sql);
                    $output['objects']=$contact;

                    $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $template_id . "' AND SECTION_LEVEL <> 3 ";
                    $sql.=" ORDER BY SECTION_ORDER";
                    $sections=$this->X->sql($sql);
                    $output['sections']=$sections;
                    $pages=array();
                    if ($data['id']!="") {

                    } else {
                        $output['current_section']=array();
                        $output['paragraphs']=array();
                    }
            }
          return $output;
    }

    function getQuestions($data) {
            $output=array();
            $user=$this->getUser($data);
            $template_id=$data['id'];
            $building_nbr=$data['id2'];
            $contact_id=$data['id3'];
           if ($contact_id=='') $contact_id = 0;


            if ($user['forced_off']==1) {
                    $output=array();
                    $output['user']=$user;
                    return $output;
            } else {

                    $output=array();
                    $output['user']=$user;
                    if ($data['id']=="") {
                            $data['id']="0";
                    }
                    $output['BUILDING_NBR']=$building_nbr;
                    $output['TEMPLATE_ID']=$template_id;
                    $sql="select * from DHS_TEMPLATE WHERE TEMPLATE_ID = '" . $template_id . "'";
                    $template=$this->X->sql($sql);
                    $output['template']=$template[0];

                    $sql="select * from RWH_DIM_FACILITY WHERE BUILDING_NBR = '" . $building_nbr . "'";
                    $template=$this->X->sql($sql);
                    $output['building']=$template[0];

                    $sql="select * from DSH_TEMPLATE_QUESTION WHERE TEMPLATE_ID = '" . $template_id . "' ORDER BY SECTION_ID";
                    $template=$this->X->sql($sql);
                    $output['list']=$template;

                    $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $template_id . "' AND SECTION_LEVEL <> 3 ";
                    $sql.=" ORDER BY SECTION_ORDER";
                    $sections=$this->X->sql($sql);
                    $output['sections']=$sections;
                    $pages=array();
                    if ($data['id']!="") {

                    } else {
                        $output['current_section']=array();
                        $output['paragraphs']=array();
                    }
            }
          return $output;
    }

    function postAddSection($data) {
            $post=array();
            $post['TABLE_NAME']="DHS_TEMPLATE_SECTION";
            $post['TEMPLATE_ID']=$data['data']['TEMPLATE_ID'];
            $post['SECTION_ID']=$data['data']['SECTION_ID'];
            $post['SECTION_NAME']=$data['data']['SECTION_NAME'];
            $post['SECTION_ORDER']=$data['data']['SECTION_ORDER'];
            $post['SECTION_LEVEL']=$data['data']['SECTION_LEVEL'];
            $this->X->post($post);
            $output=array();
            $output['error_code']=0;
            return $output;


    }

    function hideSection($data) {
           $mplate_id=$data['data']['TEMPLATE_ID'];
           $building_nbr=$data['data']['BUILDING_NBR'];
           $section_id=$data['data']['SECTION_ID'];

           $sql="select * from DHS_PLAN_SECTION WHERE BUILDING_NBR = '" . $building_nbr . "' AND ";
           $sql.=" TEMPLATE_ID = '" . $template_id . "' ";
           $sql.=" AND SECTION_ID = " . $section_id;
           $s=$this->X->sql($sql);
           if (sizeof($s)>0) {
               $hidden=$s[0]['HIDDEN'];
               if ($hidden=='N') {
                       $hidden='Y';
               } else {
                       $hidden='N';
               }
               $sql="update DHS_PLAN_SECTION SET HIDDEN = '" . $hidden . "' WHERE ";
               $sql.=" BUILDING_NBR = '" . $building_nbr . "' AND ";
               $sql.=" TEMPLATE_ID = '" . $template_id . "' ";
               $sql.=" AND SECTION_ID = " . $section_id;
               $this->X->execute($sql);
           }
               $output=array();
               $output['error_code']=0;
               return $output;
    }

    function getPlanSection($data) {
            $output=array();
            $user=$this->getUser($data);
            $template_id=$data['id'];
            $building_nbr=$data['id2'];
            $section_id=$data['id3'];

            if ($user['forced_off']==1) {
                    $output=array();
                    $output['user']=$user;
                    return $output;
            } else {

                    $output=array();
                    $output['user']=$user;
                    if ($data['id']=="") {
                            $data['id']="0";
                    }

                    //
                    //-- Get the template
                    //

                    $sql="select ID, TAG, DATA_NAME from DHS_DATA_SOURCE ORDER BY TAG";
                    $template=$this->X->sql($sql);
                    $output['tags']=$template;

                    $sql="select * from DHS_TEMPLATE WHERE TEMPLATE_ID = '" . $template_id . "'";
                    $template=$this->X->sql($sql);
                    $output['template']=$template[0];

                    //
                    //-- Get the facility
                    //

                    $sql="select * from RWH_DIM_FACILITY WHERE BUILDING_NBR = '" . $building_nbr . "'";
                    $building=$this->X->sql($sql);
                    if (sizeof($building)>0) {
                        $output['building']=$building[0];
                    } else {
                        $output['building']=array();
                        $output['BUILDING_NBR']=$building_nbr;
                        $output['FACILITY_NAME']="Building Not Found";
                    }
                    //
                    //-- Get the Plan
                    //

                    $output['questions']=array();

                    $sql="select * from DHS_PLAN WHERE BUILDING_NBR = '" . $building_nbr . "' AND TEMPLATE_ID = '" . $template_id . "'";
                    $plan=$this->X->sql($sql);
                    if (sizeof($plan)==0) {
                       //
                       //-- Create the Plan
                       //
                       $post=array();
                       $post['table_name']="DHS_PLAN";
                       $post['BUILDING_NBR']=$building_nbr;
                       $post['TEMPLATE_ID']=$template_id;
                       $post['DOCUMENT_TITLE']=$output['template']['TEMPLATE_NAME'];
                       $plan_id=$this->X->post($post);
                       $sql="select * from DHS_PLAN WHERE BUILDING_NBR = '" . $building_nbr . "' AND TEMPLATE_ID = '" . $template_id . "'";
                       $plan=$this->X->sql($sql);
                       //
                       //-- Add all the sections
                       //
                       $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $template_id . "'";
                       $sql.=" ORDER BY SECTION_ORDER";
                       $sections=$this->X->sql($sql);
                       foreach($sections as $s) {
                               $post=array();
                               $post['table_name']="DHS_PLAN_SECTION";
                               $post['PLAN_ID']=$plan_id;
                               $post['TEMPLATE_ID']=$template_id;
                               $post['BUILDING_NBR']=$building_nbr;
                               $post['SECTION_ID']=$s['SECTION_ID'];
                               $post['SECTION_NAME']=$s['SECTION_NAME'];
                               $post['SECTION_TITLE']=$s['SECTION_NAME'];
                               $post['SECTION_ORDER']=$s['SECTION_ORDER'];
                               $post['SECTION_LEVEL']=$s['SECTION_LEVEL'];
                               $post['HELP']=$s['HELP'];
                               $post['JSON']=$s['JSON'];
                               $post['HTML']=$s['HTML'];
                               $this->X->post($post);
                       }

                    }
                    $output['plan']=$plan[0];

                    $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $template_id . "' AND SECTION_LEVEL <> 3 ";
                    $sql.=" ORDER BY SECTION_ORDER";
                    $sections=$this->X->sql($sql);
                    $tt=array();
                    foreach($sections as $s) {
                           $sql="select * from DHS_PLAN_SECTION WHERE TEMPLATE_ID = '" . $template_id . "' AND ";
                           $sql.=" BUILDING_NBR = '" . $building_nbr . "' AND SECTION_ID = " . $s['SECTION_ID'];
                           $z=$this->X->sql($sql);
                           if (sizeof($z)>0) {
                                   if ($z[0]['HIDDEN']=='Y') {
                                       $s['HIDDEN']='Y';
                                   } else {
                                       $s['HIDDEN']='N';
                                   }
                           } else {
                              $s['HIDDEN']='M';
                           }
                    array_push($tt,$s);
                    }
                    $output['sections']=$tt;
                    $pages=array();
                    if ($data['id']!="") {
                        $sql="select * from DHS_PLAN_SECTION ";
                        $sql.="WHERE TEMPLATE_ID = '" . $template_id . "' AND BUILDING_NBR = '" . $building_nbr . "' AND SECTION_ID = " . $section_id;
                        $cs=$this->X->sql($sql);
                        if (sizeof($cs)>0) {
                                $output['current_section']=$cs[0];
                                if ($this->isJSON($cs[0]['JSON'])) {
                                        $output['current_section']['JSON']=json_decode($cs[0]['JSON'],true);
                                } else {
                                        $output['current_section']['JSON']=$this->makeDefault();
                                }
                        } else {
                                $output['current_section']=array();
                                $output['current_section']['HELP']="";
                                $output['current_section']['JSON']=$this->makeDefault();
                                $output['current_section']['HTML']="";
                        }
                    } else {
                        $output['current_section']=array();
                        $output['paragraphs']=array();
                    }
                    $formData=array();
                    $formData['ID']=$data['id'];
                    $formData['TEMPLATE_ID']=$data['id'];
                    $formData['PLAN_ID']=$output['plan']['ID'];
                    $formData['BUILDING_NBR']=$building_nbr;
                    $formData['SECTION_ID']=$data['id3'];
//                  $formData['HELP']=$output['current_section']['HELP'];
                    $formData['JSON']=$output['current_section']['JSON'];
                    $formData['HTML']=$output['current_section']['HTML'];
                    $output['formData']=$formData;
            }
          return $output;
    }

   function getTemplateList($data) {

   }

    function postAddSectionTable($data) {
        $output['error_code']=0;
        return($output);
    }

   function postSectionTemplate($data) {

           $post=array();
           $post['table_name']="DHS_TEMPLATE_SECTION";
           $post['action']="insert";
           $post['SECTION_ID']=$data['data']['SECTION_ID'];
           $post['HTML']=$data['data']['HTML'];
           $post['JSON']=$data['data']['JSON'];

           $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $data['data']['TEMPLATE_ID'] . "' AND SECTION_ID = " . $data['data']['SECTION_ID'];
           $g=$this->X->sql($sql);
           if (sizeof($g)>0) {
                   $post['ID']=$g[0]['ID'];
           }
           $this->X->post($post);
           $output=array();
           $output['error_code']=0;
           return($output);
   }

   function postSectionInstructions($data) {
           $post=array();
           $post['table_name']="DHS_TEMPLATE_SECTION";
           $post['action']="insert";
           $post['SECTIONID']=$data['data']['SECTION_ID'];
           $post['HELP']=$data['data']['HELP'];

           $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $data['data']['TEMPLATE_ID'] . "' AND SECTION_ID = " . $data['data']['SECTION_ID'];
           $g=$this->X->sql($sql);
           if (sizeof($g)>0) {
                   $post['ID']=$g[0]['ID'];
           }
           $this->X->post($post);
           $output=array();
           $output['error_code']=0;
           return($output);
   }
   function postPlanSection($data) {
           $sql="select * from DHS_PLAN_SECTION WHERE BUILDING_NBR = '" . $data['data']['BUILDING_NBR'] . "' ";
           $sql.=" AND TEMPLATE_ID = '" . $data['data']['TEMPLATE_ID'] . "' ";
           $sql.=" AND SECTION_ID = " . $data['data']['SECTION_ID'];
           $z=$this->X->sql($sql);
           if (sizeof($z)>0) {
               $post=array();
               $post['table_name']="DHS_PLAN_SECTION";
               $post['action']="insert";
               $post['ID']=$z[0]['ID'];
               $post['HTML']=$data['data']['HTML'];
               $post['JSON']=$data['data']['JSON'];
               $this->X->post($post);
           }
               $output=array();
               $output['error_code']=0;
               return($output);
}

   function postAddTemplate($data) {
           $data['data']['TEMPLATE_ID']=strtoupper($data['data']['TEMPLATE_ID']);

           $sql="select * from DHS_TEMPLATE WHERE TEMPLATE_ID = '" . $data['data']['TEMPLATE_ID'] . "' ";
           $z=$this->X->sql($sql);
           if (sizeof($z)==0) {
               $post=array();
               $post['table_name']="DHS_TEMPLATE";
               $post['action']="insert";
               $post['TEMPLATE_ID']=$data['data']['TEMPLATE_ID'];
               $post['TEMPLATE_NAME']=$data['data']['TEMPLATE_NAME'];
               $this->X->post($post);

               $post=array();
               $post['table_name']="DHS_TEMPLATE_SECTION";
               $post['action']="insert";
               $post['SECTION_ID']=100;
               $post['SECTION_ORDER']=100;
               $post['SECTION_LEVEL']=1;
               $post['TEMPLATE_ID']=$data['data']['TEMPLATE_ID'];
               $post['SECTION_NAME']="Title Page";
               $post['HELP']="";
               $post['JSON']="";
               $post['HTML']="";
               $this->X->post($post);
               $post=array();
               $post['table_name']="DHS_TEMPLATE_SECTION";
               $post['action']="insert";
               $post['SECTION_ID']=200;
               $post['SECTION_ORDER']=200;
               $post['SECTION_LEVEL']=1;
               $post['TEMPLATE_ID']=$data['data']['TEMPLATE_ID'];
               $post['SECTION_NAME']="Table of Contents";
               $post['HELP']="";
               $post['JSON']="";
               $post['HTML']="";
               $this->X->post($post);
           }
               $output=array();
               $output['error_code']=0;
               return($output);
}

   function reloadSection($data) {
           $sql="delete from DHS_PLAN_SECTION WHERE PLAN_ID = " . $data['data']['PLAN_ID'] . " AND SECTION_ID = " . $data['data']['SECTION_ID'];
           $this->X->execute($sql);

           $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $data['data']['TEMPLATE_ID'] . "' AND SECTION_ID = " . $data['data']['SECTION_ID'];
           $sql.=" ORDER BY SECTION_ORDER";
           $sections=$this->X->sql($sql);
           foreach($sections as $s) {
              $post=array();
               $post['table_name']="DHS_PLAN_SECTION";
                           $post['PLAN_ID']=$data['data']['PLAN_ID'];
                               $post['TEMPLATE_ID']=$data['data']['TEMPLATE_ID'];
                               $post['BUILDING_NBR']=$data['data']['BUILDING_NBR'];
                               $post['SECTION_ID']=$s['SECTION_ID'];
                               $post['SECTION_NAME']=$s['SECTION_NAME'];
                               $post['SECTION_TITLE']=$s['SECTION_NAME'];
                               $post['SECTION_ORDER']=$s['SECTION_ORDER'];
                               $post['SECTION_LEVEL']=$s['SECTION_LEVEL'];
                               $post['HELP']=$s['HELP'];
                               $post['JSON']=$s['JSON'];
                               $post['HTML']=$s['HTML'];
                               $post['HIDDEN']="N";
                               $this->X->post($post);
                       }
               $output=array();
               $output['error_code']=0;
               return($output);
   }

   function reloadTemplate($data) {
           $sql="delete from DHS_PLAN_SECTION WHERE PLAN_ID = " . $data['data']['PLAN_ID'];
           $this->X->execute($sql);

           $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $data['data']['TEMPLATE_ID'] . "'";
           $sql.=" ORDER BY SECTION_ORDER";
           $sections=$this->X->sql($sql);
           foreach($sections as $s) {
              $post=array();
               $post['table_name']="DHS_PLAN_SECTION";
                           $post['PLAN_ID']=$data['data']['PLAN_ID'];
                               $post['TEMPLATE_ID']=$data['data']['TEMPLATE_ID'];
                               $post['BUILDING_NBR']=$data['data']['BUILDING_NBR'];
                               $post['SECTION_ID']=$s['SECTION_ID'];
                               $post['SECTION_NAME']=$s['SECTION_NAME'];
                               $post['SECTION_TITLE']=$s['SECTION_NAME'];
                               $post['SECTION_ORDER']=$s['SECTION_ORDER'];
                               $post['SECTION_LEVEL']=$s['SECTION_LEVEL'];
                               $post['HELP']=$s['HELP'];
                               $post['JSON']=$s['JSON'];
                               $post['HTML']=$s['HTML'];
                               $post['HIDDEN']="N";
                               $this->X->post($post);
                       }
               $output=array();
               $output['error_code']=0;
               return($output);
}

function getSourceList($data) {
  $output=array();
  $user=$this->getUser($data);
    $template_id=$data['id'];
    $section_id=$data['id2'];

    if ($user['forced_off']==1) {
            $output=array();
            $output['user']=$user;
            return $output;
    } else {
            $sql="SELECT * from DHS_DATA_SOURCE order by DATA_NAME";
            $t=$this->X->sql($sql);
            $output['user']=$user;
            $output['list']=$t;
    }
    return $output;

}

function moveSectionForward($data) {
        $section=$data['data']['ID'];
        $template=$data['data']['TEMPLATE_ID'];
        $sql="select * from DHS_TEMPLATE_SECTION WHERE ID = " . $section;
        $s=$this->X->sql($sql);
        $sec=$s[0];
        $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $template . "' AND ";
        $sql.=" SECTION_ORDER > " . $sec['SECTION_ORDER'] . " ORDER BY SECTION_ORDER";
        $less=$this->X->sql($sql);
        if (sizeof($less)==0) {

        } else {
             $next_order = $less[0]['SECTION_ORDER'];
             if (sizeof($less)>1) {
                 $second_order = $less[1]['SECTION_ORDER'];
             } else {
                 $second_order = 5000;
             }
             $t=$next_order+$second_order;

             $new_order = round($t/2,2);
             $sql="UPDATE DHS_TEMPLATE_SECTION SET SECTION_ORDER = " . $new_order . " WHERE ID = " . $section;
             $this->X->execute($sql);

        }
        $output=array();
        $output['error_code']=0;
        return $output;

}

function moveSectionBack($data) {
        $section=$data['data']['ID'];
        $template=$data['data']['TEMPLATE_ID'];
        $sql="select * from DHS_TEMPLATE_SECTION WHERE ID = " . $section;
        $s=$this->X->sql($sql);
        $sec=$s[0];
        $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $template . "' AND ";
        $sql.=" SECTION_ORDER > " . $sec['SECTION_ORDER'] . " ORDER BY SECTION_ORDER";
        $greater=$this->X->sql($sql);
        $sql="select * from DHS_TEMPLATE_SECTION WHERE TEMPLATE_ID = '" . $template . "' AND ";
        $sql.=" SECTION_ORDER < " . $sec['SECTION_ORDER'] . " ORDER BY SECTION_ORDER DESC";
        $less=$this->X->sql($sql);
        if (sizeof($less)==0) {
                $output=array();
                $output['error_code']=0;
                return $output;
        } else {
             $next_order = $less[0]['SECTION_ORDER'];
             if (sizeof($less)>1) {
                 $second_order = $less[1]['SECTION_ORDER'];
             } else {
                 $second_order = 0;
             }
             $t=$next_order+$second_order;

             $new_order = round($t/2,2);
             $sql="UPDATE DHS_TEMPLATE_SECTION SET SECTION_ORDER = " . $new_order . " WHERE ID = " . $section;
             $this->X->execute($sql);

        }
                $output=array();
                $output['error_code']=0;
                return $output;

}

function postAddContact($data) {
    $post=$data['data'];
    $post['table_name']="FPS_FACILITY_CONTACTS";
    $post['action']="insert";
    $this->X->post($post);
    $output=array();
    $output['error_code']=0;
    $output['error']=0;
    return $output;
}

function postAddQuestion($data) {

        $post=array();
        $post['action']="insert";
        $post['ID']=$data['data']['ID'];
        $post['TABLE_NAME']="DHS_TEMPLATE_QUESTION";
        $post['TEMPLATE_ID']=$data['data']['TEMPLATE_ID'];
        $post['SECTION_ID']=$data['data']['SECTION_ID'];
        $post['TAG_NAME']=$data['data']['TAG_NAME'];
        $post['OPTIONID']=$data['data']['OPTIONID'];
        $post['QUESTION_TYPE']=$data['data']['QUESTION_TYPE'];
        $post['CUSTOM_SQL']=$data['data']['CUSTOM_SQL'];
        $post['DATA_SOURCE']=$data['data']['DATA_SOURCE'];
        $post['QUESTION']=$data['data']['QUESTION'];
        $post['DEFAULT_VALUE']=$data['data']['DEFAULT_VALUE'];
        $post['ROW_COUNT']=$data['data']['ROW_COUNT'];
        $post['COL_COUNT']=$data['data']['COL_COUNT'];
        $post['TABLE_HEADER']=$data['data']['TABLE_HEADER'];
        $post['TABLE_STYLE']=$data['data']['TABLE_STYLE'];
        $post['TABLE_WIDTH']=$data['data']['TABLE_WIDTH'];
        $id=$this->X->post($post);
        $sql="DELETE FROM DHS_TEMPLATE_QUESTION_CELL WHERE QUESTION_ID = " . $id;
        $this->X->execute($sql);
                    if ($post['QUESTION_TYPE']=='DATA') {
                        $p=array();
                        $p['action']="insert";
                        $p['TABLE_NAME']="DHS_TEMPLATE_QUESTION_CELL";
                        $p['QUESTION_ID']=$id;
                        $p['ROW_ID']=0;
                       $p['COL_ID']=1;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_COL_1'];
                        $this->X->post($p);
                        $p['COL_ID']=2;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_COL_2'];
                        $this->X->post($p);
                        $p['COL_ID']=3;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_COL_3'];
                        $this->X->post($p);
                        $p['COL_ID']=4;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_COL_4'];
                        $this->X->post($p);
                        $p['COL_ID']=5;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_COL_5'];
                        $this->X->post($p);
                        $p['COL_ID']=6;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_COL_6'];
                        $this->X->post($p);
                        $p['COL_ID']=7;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_COL_7'];
                        $this->X->post($p);
                        $p['COL_ID']=8;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_COL_8'];
                        $this->X->post($p);
                        $p['COL_ID']=9;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_COL_9'];
                        $this->X->post($p);
                        $p['COL_ID']=10;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_COL_10'];
                        $this->X->post($p);

                        $p['ROW_ID']=0;
                        $p['COL_ID']=1;
                        $p['DEFAULT_VALUE']=$data['data']['COL_1'];
                        $this->X->post($p);
                        $p['COL_ID']=2;
                        $p['DEFAULT_VALUE']=$data['data']['COL_2'];
                        $this->X->post($p);
                        $p['COL_ID']=3;
                        $p['DEFAULT_VALUE']=$data['data']['COL_3'];
                        $this->X->post($p);
                        $p['COL_ID']=4;
                        $p['DEFAULT_VALUE']=$data['data']['COL_4'];
                        $this->X->post($p);
                        $p['COL_ID']=5;
                        $p['DEFAULT_VALUE']=$data['data']['COL_5'];
                        $this->X->post($p);
                        $p['COL_ID']=6;
                        $p['DEFAULT_VALUE']=$data['data']['COL_6'];
                        $this->X->post($p);
                        $p['COL_ID']=7;
                        $p['DEFAULT_VALUE']=$data['data']['COL_7'];
                        $this->X->post($p);
                        $p['COL_ID']=8;
                        $p['DEFAULT_VALUE']=$data['data']['COL_8'];
                        $this->X->post($p);
                        $p['COL_ID']=9;
                        $p['DEFAULT_VALUE']=$data['data']['COL_9'];
                        $this->X->post($p);
                        $p['COL_ID']=10;
                        $p['DEFAULT_VALUE']=$data['data']['COL_10'];
                        $this->X->post($p);
                     }
                    if ($post['QUESTION_TYPE']=='DISPLAY') {
                        $p=array();
                        $p['action']="insert";
                        $p['TABLE_NAME']="DHS_TEMPLATE_QUESTION_CELL";
                        $p['QUESTION_ID']=$id;
                        $p['COL_ID']=0;
                        $p['ROW_ID']=1;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_ROW_1'];
                        $this->X->post($p);
                        $p['ROW_ID']=2;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_ROW_2'];
                        $this->X->post($p);
                        $p['ROW_ID']=3;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_ROW_3'];
                        $this->X->post($p);
                        $p['ROW_ID']=4;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_ROW_4'];
                        $this->X->post($p);
                        $p['ROW_ID']=5;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_ROW_5'];
                        $this->X->post($p);
                        $p['ROW_ID']=6;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_ROW_6'];
                        $this->X->post($p);
                        $p['ROW_ID']=7;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_ROW_7'];
                        $this->X->post($p);
                        $p['ROW_ID']=8;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_ROW_8'];
                        $this->X->post($p);
                        $p['ROW_ID']=9;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_ROW_9'];
                        $this->X->post($p);
                        $p['ROW_ID']=10;
                        $p['DEFAULT_VALUE']=$data['data']['HEADER_ROW_10'];
                        $this->X->post($p);
                        $p['COL_ID']=1;
                        $p['ROW_ID']=1;
                        $p['DEFAULT_VALUE']=$data['data']['ROW_1'];
                        $this->X->post($p);
                        $p['ROW_ID']=2;
                        $p['DEFAULT_VALUE']=$data['data']['ROW_2'];
                        $this->X->post($p);
                        $p['ROW_ID']=3;
                        $p['DEFAULT_VALUE']=$data['data']['ROW_3'];
                        $this->X->post($p);
                        $p['ROW_ID']=4;
                        $p['DEFAULT_VALUE']=$data['data']['ROW_4'];
                        $this->X->post($p);
                        $p['ROW_ID']=5;
                        $p['DEFAULT_VALUE']=$data['data']['ROW_5'];
                        $this->X->post($p);
                        $p['ROW_ID']=6;
                        $p['DEFAULT_VALUE']=$data['data']['ROW_6'];
                        $this->X->post($p);
                        $p['ROW_ID']=7;
                        $p['DEFAULT_VALUE']=$data['data']['ROW_7'];
                        $this->X->post($p);
                        $p['ROW_ID']=8;
                        $p['DEFAULT_VALUE']=$data['data']['ROW_8'];
                        $this->X->post($p);
                        $p['ROW_ID']=9;
                        $p['DEFAULT_VALUE']=$data['data']['ROW_9'];
                        $this->X->post($p);
                        $p['ROW_ID']=10;
                        $p['DEFAULT_VALUE']=$data['data']['ROW_10'];
                        $this->X->post($p);

                    }


        $output=array();
        $output['error_code']=0;
        return $output;

}

}

//---
// BEGIN
//---

$A=new SHOOTER();
$data = file_get_contents("php://input");
$data = json_decode($data, TRUE);
$output=array();
if (!isset($data['q'])) $data['q']="user";
$aa=explode("/",$data['q']);
if (isset($aa[1])) {
     $data['q']=$aa[1];
     if (isset($aa[2])) {
         $data['id']=$aa[2];
         }
     if (isset($aa[3])) {
         $data['id2']=$aa[3];
         }
         if (isset($aa[4])) {
         $data['id3']=$aa[4];
         }
}
$output=array();

   switch ($data['q']) {
        case 'template':
           $output=$A->getTemplate($data);
           break;
        case 'instructions':
           $output=$A->getInstructions($data);
           break;
        case 'contacts':
           $output=$A->getContacts($data);
           break;
        case 'plan':
           $output=$A->getPlanSection($data);
           break;
        case 'post-section-instructions':
           $output=$A->postSectionInstructions($data);
           break;
        case 'post-section-display-table':
           $output=$A->postAddSectionTable($data);
           break;
        case 'post-section-data-table':
           $output=$A->postAddSectionTable($data);
           break;
        case 'post-section-template':
           $output=$A->postSectionTemplate($data);
           break;
        case 'post-plan-section':
           $output=$A->postPlanSection($data);
           break;
        case 'post-add-template':
           $output=$A->postAddTemplate($data);
           break;
        case 'post-add-section':
           $output=$A->postAddSection($data);
           break;
        case 'post-add-section-table':
           $output=$A->postAddSectionTable($data);
           break;
        case 'add-building-contact':
           $output=$A->getAddContact($data);
           break;
        case 'hide-section':
           $output=$A->hideSection($data);
           break;
        case 'reload-section':
           $output=$A->reloadSection($data);
           break;
        case 'reload-template':
           $output=$A->reloadTemplate($data);
           break;
        case 'post-add-contact':
           $output=$A->postAddContact($data);
           break;
        case 'data':
           $output=$A->getSourceList($data);
           break;
        case 'move-section-forward':
           $output=$A->moveSectionForward($data);
           break;
        case 'move-section-back':
           $output=$A->moveSectionBack($data);
           break;
        case 'post-add-section-question':
           $output=$A->postAddQuestion($data);
           break;
        case 'questions':
           $output=$A->getQuestions($data);
           break;
        default:
            $output=$A->getHomePage($data);
            break;
        }

$o=json_encode($output, JSON_HEX_TAG |
        JSON_HEX_APOS |
        JSON_HEX_QUOT |
        JSON_HEX_AMP |
        JSON_UNESCAPED_UNICODE);

echo $o;
?>
