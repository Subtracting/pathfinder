import Router from 'express';
import { ObjectId } from 'mongodb';

const newRouter = function (collection) {
  const router = Router();
  
  // Function for catching errors
  const errorCatcher = function(res, inputError){
    console.error(inputError);
    res.status(500);
    res.json({ status: 500, error: inputError })
  }

  // Route for getting all data
  router.get('/', (req, res) => {
    collection
      .find()
      .toArray()
      .then((docs) => res.json(docs))
      .catch((err) => errorCatcher(res, err));
  });

  // Route for getting specific routes data
  router.get('/:id', (req, res) => {
    const id = req.params.id;
    collection
      .findOne({ _id: new ObjectId(id) })
      .then((doc) => res.json(doc))
      .catch((err) => errorCatcher(res, err));
  });

  // Route for deleting specific routes 
  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    collection
      .deleteOne({ _id: new ObjectId(id) })
      .then(() => collection.find().toArray())
      .then((docs) => res.json(docs))
      .catch((err) => errorCatcher(res, err));
  });

  // Route for creating new routes
  router.post('/', (req, res) => {
    const newData = req.body;
    collection
    .insertOne(newData)
    .then((result) => {
      res.json(result);
      res.status(204);
    })
    .catch((err) => errorCatcher(res, err));
  });

  // Route for updating specific routes
 router.put('/:id', (req, res) => {
    const itemId = req.params.id;
    const updatedItem = req.body;
    
    collection
    .findOneAndUpdate({ _id: new ObjectId(itemId) }, { $set: updatedItem })
    .then(result => {
      res.json(result.value);
    })
    .catch((err) => errorCatcher(res, err));
  });
  
  return router;

};

export default newRouter;