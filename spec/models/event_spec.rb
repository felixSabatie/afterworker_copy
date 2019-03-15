require 'rails_helper'

RSpec.describe Event, type: :model do
  it 'should accept and save the event with a generated hash' do
    event = build(:event, creator: create(:user))
    expect(event.save).to be true
    expect(event.event_hash).to be_truthy
  end

  it 'should add the creator to the participants' do
    user = create(:user)
    event = create(:event, creator: user)
    expect(event.participants).to include(user)
  end

  it 'should refuse the event because hash already exists' do
    event = create(:event, creator: create(:user))
    event2 = build(:event, creator: create(:user))
    event2.event_hash = event.event_hash
    event2.validate
    expect(event2.valid?).to be false
    expect(event2.errors.messages).to have_key(:event_hash)
  end

  it 'should refuse the event because there is no creator' do
    event = build(:event)
    event.validate
    expect(event.valid?).to be false
    expect(event.errors.messages).to have_key(:creator)
  end

  context 'admin function' do
    it 'should return true for the creator' do
      user = create(:user)
      event = create(:event, creator: user)
      expect(event.user_is_admin(user)).to eq(true)
    end

    it 'should return false for a simple participant' do
      user = create(:user)
      user2 = create(:user)
      event = create(:event, creator: user)
      event.participants << user2
      expect(event.user_is_admin(user2)).to eq(false)
    end
  end

end
