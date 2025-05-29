
<?php
    // get_booking.php
    require __DIR__ . '/../../src/session.php';
    require __DIR__ . '/../../src/db_connect.php';

    header('Content-Type: application/json');

    try {
        // 変数を先にセット
        $pdo->query("SET @start_date := (SELECT reservation_period_start FROM yearly_settings WHERE id = (SELECT current_yearly_setting_id FROM app_config WHERE id = 1))");
        $pdo->query("SET @end_date := (SELECT reservation_period_end FROM yearly_settings WHERE id = (SELECT current_yearly_setting_id FROM app_config WHERE id = 1))");

        // メインクエリ
        $stmt = $pdo->prepare("
            SELECT 
                r.*, 
                u.id AS user_id, u.name AS user_name, u.phone
            FROM reservations r
            JOIN users u ON r.user_id = u.id
            WHERE r.end_date >= @start_date
            AND r.start_date <= @end_date
        ");
        $stmt->execute();
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if($isAdmin) { // 管理人
            // { status:success, 
            //   config:{},
            //   data:[
            //      { user:{id, name, phone}},
            //        booking:[{id, start,end}, {}, ...]},
            //      {}, ...] }

            $data = [];
            foreach ($bookings as $b) {
                $uid = $b['user_id'];
                if (!isset($data[$uid])) {
                    $data[$uid] = [
                        'user' => [
                            'id' => $uid,
                            'name' => $b['user_name'],
                            'phone' => $b['phone'],
                        ],
                        'booking' => []
                    ];
                }
                $data[$uid]['booking'][] = [
                    'id' => $b['id'],
                    'start' => $b['start_date'],
                    'end' => $b['end_date']
                ];
            }
        } else if($isLogin) { // ユーザー：ログイン中
            // { status:success, 
            //   config:{},
            //   bookings_user:[{id,start,end}, {},...], 
            //   booking_other:[{start,end}, {},...]}
            $userId = $_SESSION['user_id'];

            $bookings_user = [];
            $bookings_other = [];

            foreach ($bookings as $b) {
                $item = ['start' => $b['start_date'], 'end' => $b['end_date']];
                if ($b['user_id'] == $userId) {
                    $item['id'] = $b['id'];
                    $bookings_user[] = $item;
                } else {
                    $bookings_other[] = $item;
                }
            }
        } else { // ゲスト：未ログイン
            // { status:success, 
            //   config:{},
            //   bookings:[{start,end}, {},...]}

            $bookings_public = array_map(function($b) {
                return [
                    'start' => $b['start_date'],
                    'end' => $b['end_date']
                ];
            }, $bookings);
        }
    } catch(PDOException $e){
        // データベースエラー
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
?>