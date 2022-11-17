<?php
namespace dbHandler;

abstract class CompareMethods
{
    const equals = "=";
}
abstract class PropertyTypes
{
    const string = "s";
    const int = "i";
}
class dbHandler
{
    /** @var false|\mysqli  */
    private $dbConnection;
    /**
     * @param string $host
     * @param string $username
     * @param string $password
     * @parma string $database
     * @return void
     */
    function __construct(string $host, string $username, string $password, string $database)
    {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        $this->dbConnection = mysqli_connect($host, $username, $password, $database);
        $this->dbConnection->set_charset('utf8mb4');
    }
    /**
     * @param string[] | null $columns
     * @param string $table
     * @param array<array{column:string, method: string, value: array{value: mixed, type:string}}>| null $WHERE
     * @param array<array{tableToJoin:string, fromColumn:string, toColumn:string}>| null $join
     * @return array<int, array<array-key, mixed>|bool|null>|null
     */
    function select(array $columns = null, string $table, array $WHERE = null, array $join = null)
    {
        if ($this->dbConnection == false) {
            return null;
        }
        $COLUMNSSQLSTRING = "*";
        if ($columns != null) {
            $COLUMNSSQLSTRING = "";
            foreach ($columns as $key => $value) {
                if ($key === array_key_last($columns)) {
                    $COLUMNSSQLSTRING .= "`" . $value . "`";
                    break;
                }
                $COLUMNSSQLSTRING .= "`" . $value . "`,";
            }
        }

        $WHERESQLSTRING = "";
        $PROPERTYTYPES = "";
        $VALUES = [];
        if ($WHERE != null) {

            $WHERESQLSTRING = "WHERE ";

            foreach ($WHERE as $key => $value) {
                $PROPERTYTYPES .= $value["value"]["type"];
                array_push($VALUES, $value["value"]["value"]);
                if ($key === array_key_last($WHERE)) {
                    $WHERESQLSTRING .= "`" . $value["column"] . "` " . $value["method"] . " ?";
                    break;
                }
                $WHERESQLSTRING .= "`" . $value["column"] . "` " . $value["method"] . " ? AND ";
            }
        }
        $JOINSQLSTRING = "";
        if ($join != null) {
            foreach ($join as $value) {
                $JOINSQLSTRING .= "INNER JOIN " . $value["tableToJoin"] . " ON " . $value["fromColumn"] . "=" . $value["toColumn"] . " ";
            }
        }
        $query = mysqli_prepare($this->dbConnection, "SELECT " . $COLUMNSSQLSTRING . " FROM `" . $table . "`" . $JOINSQLSTRING . $WHERESQLSTRING);
        if ($PROPERTYTYPES != "") {
            $query->bind_param($PROPERTYTYPES, ...$VALUES);
        }
        $query->execute();
        $result = $query->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }
    /**
     * @param string $table
     * @param array<array{column: string, value:array{value:mixed, type:string}}> $toBeInserted
     * @return bool|null
     */
    function insert(string $table, array $toBeInserted)
    {
        if ($this->dbConnection == false) {
            return null;
        }
        $COLUMNSSQLSTRING = "";
        $VALUESSQLSTRING = "";
        $VALUES = [];
        $PROPERTYTYPES = "";
        foreach ($toBeInserted as $key => $value) {
            $PROPERTYTYPES .= $value["value"]["type"];
            array_push($VALUES, $value["value"]["value"]);
            if ($key === array_key_last($toBeInserted)) {
                $VALUESSQLSTRING .= "?";
                $COLUMNSSQLSTRING .= "`" . $value["column"] . "`";
                break;
            }
            $VALUESSQLSTRING .= "?,";
            $COLUMNSSQLSTRING .= "`" . $value["column"] . "`,";
        }
        $query = mysqli_prepare($this->dbConnection, "INSERT INTO `" . $table . "` (" . $COLUMNSSQLSTRING . ") VALUES (" . $VALUESSQLSTRING . ")");
        $query->bind_param($PROPERTYTYPES, ...$VALUES);
        $result = $query->execute();
        if ($query->affected_rows == 0) {
            return false;
        }
        return $result;
    }
    /**
     * @param string $table
     * @param array<array{column:string, method: string, value: array{value: mixed, type:string}}> $WHERE
     * @return bool|null
     */
    function delete(string $table, array $WHERE)
    {
        if ($this->dbConnection == false) {
            return null;
        }
        $WHERESQLSTRING = "";
        $VALUES = [];
        $PROPERTYTYPES = "";
        foreach ($WHERE as $key => $value) {
            $PROPERTYTYPES .= $value["value"]["type"];
            array_push($VALUES, $value["value"]["value"]);
            if ($key === array_key_last($WHERE)) {
                $WHERESQLSTRING .= "`" . $value["column"] . "` " . $value["method"] . " ?";
                break;
            }
            $WHERESQLSTRING .= "`" . $value["column"] . "` " . $value["method"] . " ? AND ";
        }
        $query = mysqli_prepare($this->dbConnection, "DELETE FROM " . $table . " WHERE " . $WHERESQLSTRING);
        $query->bind_param($PROPERTYTYPES, ...$VALUES);
        $result = $query->execute();
        if ($query->affected_rows == 0) {
            return false;
        }
        return $result;
    }
    /**
     * @param string $table
     * @param array<array{column: string, value:array{value:mixed, type:string}}> $toBeChanged
     * @param array<array{column:string, method: string, value: array{value: mixed, type:string}}> $WHERE
     * @return bool|null
     */
    function update(string $table, array $toBeChanged, array $WHERE)
    {
        if ($this->dbConnection == false) {
            return null;
        }
        $VALUES = [];
        $PROPERTYTYPES = "";
        $SETSQLSTRING = "";
        $WHERESQLSTRING = "";

        foreach ($toBeChanged as $key => $value) {
            $PROPERTYTYPES .= $value["value"]["type"];
            array_push($VALUES, $value["value"]["value"]);
            if ($key === array_key_last($toBeChanged)) {
                $SETSQLSTRING .= $value["column"] . " = ?";
                break;
            }
            $SETSQLSTRING .= $value["column"] . " = ?,";
        }
        foreach ($WHERE as $key => $value) {
            $PROPERTYTYPES .= $value["value"]["type"];
            array_push($VALUES, $value["value"]["value"]);
            if ($key === array_key_last($WHERE)) {
                $WHERESQLSTRING .= "`" . $value["column"] . "` " . $value["method"] . " ?";
                break;
            }
            $WHERESQLSTRING .= "`" . $value["column"] . "` " . $value["method"] . " ? AND ";
        }
        $query = mysqli_prepare($this->dbConnection, "UPDATE " . $table . " SET " . $SETSQLSTRING . " WHERE " . $WHERESQLSTRING);
        $query->bind_param($PROPERTYTYPES, ...$VALUES);
        $result = $query->execute();
        if ($query->affected_rows == 0) {
            return false;
        }
        return $result;
    }
}