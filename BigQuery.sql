select * from `challenge2020test.firestore_export.posts_raw_changelog`

SELECT cast(json_value(data, '$.quantity') as INT64) as quantity, cast(json_value(data, '$.continous') as bool) as continous from `challenge2020test.firestore_export.posts_raw_changelog`

 SELECT 
 ifnull(json_value(data, '$.name'), substr(substr(document_name,1,(INSTR(document_name, '/', -1, 1) -1)),(INSTR(document_name, '/', -1, 2)) +1 ,(INSTR(document_name, '/', -1, 1) -1))) as navn,
cast(json_value(data, '$.quantity') as INT64) as quantity, 
cast(json_value(data, '$.continous') as bool) as continous,
TIMESTAMP_MILLIS(
SAFE_CAST(JSON_EXTRACT(JSON_EXTRACT(data, '$.timestamp'), '$._seconds') AS INT64) * 1000 + SAFE_CAST(
SAFE_CAST(JSON_EXTRACT(JSON_EXTRACT(data, '$.timestamp'), '$._nanoseconds') AS INT64) / 1E6 AS INT64
)
) AS completedTimestamp
 from `challenge2020test.firestore_export.posts_raw_changelog`
 where document_id != 'Profile'
 and operation != 'DELETE'

 --{"age":"42","sex":"Male","timestamp":{"_seconds":1642086779,"_nanoseconds":179000000}}

SELECT ifnull(json_value(data, '$.name'), substr(substr(document_name,1,(INSTR(document_name, '/', -1, 1) -1)),(INSTR(document_name, '/', -1, 2)) +1 ,(INSTR(document_name, '/', -1, 1) -1))) as navn,
json_value(data, '$.age') as age, 
json_value(data, '$.sex') as sex,
TIMESTAMP_MILLIS(
SAFE_CAST(JSON_EXTRACT(JSON_EXTRACT(data, '$.timestamp'), '$._seconds') AS INT64) * 1000 + SAFE_CAST(
SAFE_CAST(JSON_EXTRACT(JSON_EXTRACT(data, '$.timestamp'), '$._nanoseconds') AS INT64) / 1E6 AS INT64
)
) AS updatedTimestamp
 from `challenge2020test.firestore_export.posts_raw_changelog`
 where document_id = 'Profile'
 and operation != 'DELETE'