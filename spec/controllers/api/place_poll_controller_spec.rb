require 'rails_helper'

RSpec.describe Api::PlacePollController, type: :controller do

  describe 'POST #create' do
    context 'valid params' do
      it 'should create the place poll option' do

      end

      it 'should return the place poll option' do

      end
    end

    context 'valid params and closed to suggestions' do
      it 'should create the place poll option' do

      end

      it 'should return the place poll option' do

      end
    end

    context 'wrong params' do
      it 'should return 422' do

      end

      it 'should return 404 when the event does not exist' do

      end
    end

    context 'unauthorized' do
      it 'should return 401 because the user is not logged in' do

      end

      it 'should return 401 because the user cannot access the event' do

      end

      it 'should return 401 because the user cannot suggest places' do

      end

      it 'should return 401 because the event does not have a place poll' do

      end
    end
  end

  describe 'POST #toggle' do
    context 'valid request' do
      it 'should add the user\'s vote' do

      end

      it 'should remove the user\'s vote' do

      end
    end

    context 'bad request' do
      it 'should return 404 when the event does not exist' do

      end

      it 'should return 404 when the place poll option does not exist' do

      end
    end

    context 'unauthorized' do
      it 'should return 401 because the user is not logged in' do

      end

      it 'should return 401 because the user cannot access the event' do
        
      end

      it 'should return 401 because the event does not have a place poll' do

      end
    end
  end

end
