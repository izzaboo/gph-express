SELECT row_to_json(buildings) AS location
FROM (
    SELECT json_object_agg(b.bid, b.building) AS bld
    FROM buildings b
  ) AS buildings
UNION ALL
SELECT row_to_json(rooms) AS room
FROM (
    SELECT json_object_agg(r.rid, r.room) AS rms
    FROM rooms r
  ) AS rooms
UNION ALL
SELECT row_to_json(spots) AS spot
FROM (
    SELECT json_object_agg(s.sid, s.spot) AS spt
    FROM spots s
  ) AS spots
