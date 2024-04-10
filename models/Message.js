import { model, models, Schema } from 'mongoose';

const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  name: {
    type: String,
    required: [
      true,
      'Name is required',
    ],
  },
  email: {
    type: String,
    required: [
      true,
      'Email is required',
    ],
  },
  phone: {
    type: String,
  },
  body: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

let Message;

if (models.Message) {
  Message = model('Message');
} else {
  Message = model('Message', MessageSchema);
}

export default Message;

