require 'rails_helper'

RSpec.describe Invite, type: :model do
  before(:all) do
    @event = create(:event, creator: create(:user))
    @user = create(:user)
  end

  it 'should succesfully save the invite with a generated token' do
    invite = build(:invite, user: @user, event: @event)
    expect(invite.save).to be true
    expect(invite.token).to be_truthy
  end

  context 'validation' do
    it 'should refuse the invite because token already exists' do
      invite = create(:invite, user: @user, event: @event)
      invite2 = build(:invite, user: @user, event: @event)
      invite2.token = invite.token
      invite2.validate
      expect(invite2.valid?).to be false
      expect(invite2.errors.messages).to have_key(:token)
    end
  end

  context 'relationships' do
    it 'should add the invite to the user\'s invites' do
      create(:invite, user: @user, event: @event)
      expect(@user.invites.length).to eql(1)
    end

    it 'should add the invite to the event\'s invites' do
      create(:invite, user: @user, event: @event)
      expect(@event.invites.length).to eql(1)
    end
  end
end
