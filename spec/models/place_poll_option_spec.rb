require 'rails_helper'

RSpec.describe PlacePollOption, type: :model do
  before(:all) do
    @event = create(:event, creator: create(:user))
  end

  it 'should accept and save the place poll option' do
    place_poll_option = build(:place_poll_option, event: @event)
    expect(place_poll_option.save).to be true
  end

  context 'event relationships' do
    it 'should add the place poll options to the event' do
      create(:place_poll_option, event: @event)
      create(:place_poll_option, event: @event)
      expect(@event.place_poll_options.length).to eq(2)
    end

    it 'should set the place poll option as chosen place' do
      place_poll_option = create(:place_poll_option, event: @event)
      @event.chosen_place = place_poll_option
      expect(@event.save).to be true
    end
  end

  context 'voters' do
    it 'should add the users to the voters' do
      user1 = create(:user)
      user2 = create(:user)
      place_poll_option = create(:place_poll_option, event: @event)
      place_poll_option.voters << user1 << user2

      expect(place_poll_option.voters.length).to eql(2)
    end

    it 'should add the user only once to the voters' do
      user1 = create(:user)
      place_poll_option = create(:place_poll_option, event: @event)
      place_poll_option.voters << user1

      expect { place_poll_option.voters << user1 }.to raise_error(ActiveRecord::RecordNotUnique)
      expect(place_poll_option.voters.length).to eql(1)
    end
  end
end
