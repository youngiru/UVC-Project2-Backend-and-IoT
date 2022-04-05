const express = require('express');

const router = express.Router();
const logger = require('../lib/logger');
const sensorService = require('../service/sensorService');

// 등록
router.post('/', async (req, res) => {
  try {
    const params = {
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      operating: req.body.operating,
    };
    logger.info(`(sensor.reg.params) ${JSON.stringify(params)}`);

    // 입력값 null 체크
    if (!params.name) {
      const err = new Error('Not allowed null (name)');
      logger.error(err.toString());

      res.status(500).json({ err: err.toString() });
    }

    // 비즈니스 로직 호출
    const result = await sensorService.reg(params);
    logger.info(`(sensor.reg.result) ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

// 리스트 조회
router.get('/', async (req, res) => {
  try {
    const params = {
      name: req.query.name,
      sensorid: req.query.sensorid,
    };
    logger.info(`(sensor.list.params) ${JSON.stringify(params)}`);

    const result = await sensorService.list(params);
    logger.info(`(sensor.list.result) ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

// 상세정보 조회
router.get('/:id', async (req, res) => {
  try {
    const params = {
      id: req.params.id,
    };
    logger.info(`(sensor.info.params) ${JSON.stringify(params)}`);

    const result = await sensorService.info(params);
    logger.info(`(sensor.info.result) ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

// 수정
// router.put('/:id', async (req, res) => {
//   try {
//     const params = {
//       id: req.params.id,
//       name: req.body.name,
//       location: req.body.location,
//       description: req.body.description,
//     };
//     logger.info(`(sensor.update.params) ${JSON.stringify(params)}`);

//     const result = await sensorService.edit(params);
//     logger.info(`(sensor.update.result) ${JSON.stringify(result)}`);

//     // 최종 응답
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(500).json({ err: err.toString() });
//   }
// });

// 삭제
router.delete('/:id', async (req, res) => {
  try {
    const params = {
      id: req.params.id,
    };
    logger.info(`(sensor.delete.params) ${JSON.stringify(params)}`);

    const result = await sensorService.delete(params);
    logger.info(`(sensor.delete.result) ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

// 가동 상태 변동
// eslint-disable-next-line consistent-return
router.patch('/:id', async (req, res) => {
  try {
    const params = {
      id: req.params.id,
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      operating: req.body.operating,
    };
    logger.info(`(sensor.patch.params) ${JSON.stringify(params)}`);

    const operatingStatus = await sensorService.check(params);

    // 가동상태 전후 비교
    if (operatingStatus === params.operating) {
      return res.status(401).json({
        msg: '가동 상태를 확인해주세요',
      });
    }
    if (operatingStatus !== params.operating) {
      const result = await sensorService.edit(params);
      logger.debug(`(operatingStatus.result) ${result}`);
      // 최종 응답
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

module.exports = router;